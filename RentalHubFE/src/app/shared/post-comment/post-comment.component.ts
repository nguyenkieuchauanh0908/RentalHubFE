import { Component, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { ForumService } from 'src/app/forum/forum.service';
import { ChatBotService, UserChatsType } from '../chat-bot/chat-bot.service';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
})
export class PostCommentComponent implements OnInit {
  @Input() comment: any;
  moment!: any;
  $destroy: Subject<Boolean> = new Subject();
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;
  shouldOpenReplies: boolean = false;
  replies: any[] | null = null;

  currentReplyPage: number = 0;
  totalReplyPage: number = 0;
  replyLimit: number = 5;

  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moment = moment;
    this.moment.locale('vn');
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

  addToContactAndGoToChatBot() {
    console.log('addToContactAndGoToChatBot');
    if (this.currentUser && this.comment._uId) {
      //Thêm chat mới vào chat's list (nếu chưa có trong chat list); update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
      let updatedChats: UserChatsType[] | null = null;
      this.chatBotService
        .createNewChat(this.currentUser._id, this.comment._uId)
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

  seeProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        profileName: this.comment._name,
        profileImage: this.comment._avatar,
      },
    };

    this.router.navigate(
      ['/forum/profile', this.comment._uId],
      navigationExtras
    );
  }

  openReplies(opened: boolean) {
    this.shouldOpenReplies = opened;
    if (
      !this.replies &&
      this.shouldOpenReplies &&
      this.currentReplyPage < this.totalReplyPage
    ) {
      //Gọi API lấy comments repies
    }
  }
}
