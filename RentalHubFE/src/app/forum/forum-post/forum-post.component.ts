import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
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
import { SocialPostEditDialogComponent } from '../social-post-edit-dialog/social-post-edit-dialog.component';
import { ForumPostModel } from './forum-post.model';
import { state } from '@angular/animations';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss'],
})
export class ForumPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialContentToDisplay') socialContentToDisplay:
    | ElementRef
    | undefined;
  @Input() post!: ForumPostModel;
  @Output() changePostStatus: EventEmitter<{ status: number; pId: string }> =
    new EventEmitter();
  $destroy: Subject<Boolean> = new Subject();
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  seeMore: boolean = false;
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;

  postCommentsToDisplay: any[] | null = null;
  currentCommentPage: number = 1;
  commentLimt: number = 5;
  totalCommentPage: number = 0;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private notifierService: NotifierService,
    private forumService: ForumService
  ) {}
  ngAfterViewInit(): void {
    this.socialContentToDisplay!.nativeElement.innerHTML = this.post._content;
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.isAuthenticated = !!user;
          this.currentUser = user;
          if (this.post) {
            this.isLoading = false;
            this.forumService
              .getParentCommentsOfPost(
                this.post._id,
                this.currentCommentPage,
                this.commentLimt
              )
              .pipe(takeUntil(this.$destroy))
              .subscribe(
                (res) => {
                  if (res.data) {
                    this.postCommentsToDisplay = res.data;
                  }
                },
                (err) => {}
              );
          }
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

  editPost() {
    console.log('On editing post...');
    const dialogRef = this.dialog.open(SocialPostEditDialogComponent, {
      width: '800px',
      data: this.post,
    });
    const sub = dialogRef.componentInstance.updateSucess.subscribe(
      (updatedPost) => {
        console.log(
          '🚀 ~ ForumPostComponent ~ editPost ~ updatedPost:',
          updatedPost
        );
        this.post._title = updatedPost._title;
        this.post._content = updatedPost._content;
        if (updatedPost._images) {
          this.post._images = updatedPost._images;
        }
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  updateStatusTo(updatedStatus: number) {
    console.log('On update status to', updatedStatus);
    this.changePostStatus.emit({ status: updatedStatus, pId: this.post._id });
  }

  seeProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        profileName: this.post._authorName,
        profileImage: this.post._images,
      },
    };

    this.router.navigate(
      ['/forum/profile', this.post._authorId],
      navigationExtras
    );
  }

  likePost(liked: boolean) {
    console.log('Like or unlike post:', liked);
    this.forumService
      .likeOrUnlikePost(this.post._id)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.post._isLiked = liked;
          this.post._totalLike = res.data._totalLike;
        }
      });
  }
}
