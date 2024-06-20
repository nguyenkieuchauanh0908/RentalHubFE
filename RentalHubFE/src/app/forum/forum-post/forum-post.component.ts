import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { ForumService } from '../forum.service';
import {
  ChatBotService,
  UserChatsType,
} from 'src/app/shared/chat-bot/chat-bot.service';
import { User } from 'src/app/auth/user.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss'],
})
export class ForumPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialContentToDisplay') socialContentToDisplay:
    | ElementRef
    | undefined;
  @Input() post: any;
  $destroy: Subject<Boolean> = new Subject();
  isAuthenticated: boolean = false;
  seeMore: boolean = false;
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private notifierService: NotifierService
  ) {}
  ngAfterViewInit(): void {
    this.socialContentToDisplay!.nativeElement.innerHTML = this.post._content;
  }
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(false);
    this.$destroy.unsubscribe();
  }

  seeMoreContentClick() {
    this.seeMore = !this.seeMore;
  }

  seeComments() {
    if (this.isAuthenticated) {
      //Load comments
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: 'Bạn cần phải đăng nhập để bình luận',
      });
      const sub = dialogRef.componentInstance.confirmYes
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => {
          sub.unsubscribe();
        });
    }
  }

  addToContactAndGoToChatBot() {
    console.log('addToContactAndGoToChatBot');
    if (this.currentUser && this.post._authorId) {
      //Thêm chat mới vào chat's list (nếu chưa có trong chat list); update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
      let updatedChats: UserChatsType[] | null = null;
      this.chatBotService
        .createNewChat(this.currentUser._id, this.post._authorId)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.chatBotService.setChatBotMenuOpened(true);
            this.chatBotService.setSeeContactList(false);
            this.chatBotService.getCurrentUserChats.subscribe((chats) => {
              if (chats) {
                updatedChats = chats;
              }
            });
            //Kiểm tra xem chat đã tồn tại chưa, nếu chưa thì cập nhật lại userChats
            let chatExisted = false;
            for (let i = 0; i < updatedChats!.length; i++) {
              if (updatedChats![i]._id === res.data._id) {
                chatExisted = true;
                break;
              }
            }
            if (!chatExisted) {
              this.chatBotService.setCurrentUserChats([
                res.data,
                ...updatedChats!,
              ]);
            }

            this.chatBotService.setCurrentChat(res.data);
          }
        });
    }
  }
}
