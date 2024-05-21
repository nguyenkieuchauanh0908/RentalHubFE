import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ChatBotService, UserChatsType } from './chat-bot.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit, OnDestroy {
  @ViewChild('chatBotTrigger') chatBotManuTrigger!: MatMenuTrigger;
  isLoading = false;
  seeContactList: Boolean = false;
  onChatBot = false;
  isAuthenticated = false;
  totalUnreadMsgs: number | null = 0;
  currentUser: User | null = null;
  currentChats: UserChatsType[] | null = null;
  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private chatBotService: ChatBotService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.isAuthenticated = false;
    this.onChatBot = false;
    this.seeContactList = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
        if (user) {
          this.currentUser = user;
          //Lấy tất cả các chats của users
          this.chatBotService.getCurrentUserChats
            .pipe(takeUntil(this.$destroy))
            .subscribe((chats) => {
              if (!chats) {
                this.chatBotService
                  .fetchMyChats(user._id)
                  .pipe(takeUntil(this.$destroy))
                  .subscribe((res) => {
                    if (res.data) {
                      this.chatBotService.getCurrentUserChats
                        .pipe(takeUntil(this.$destroy))
                        .subscribe((chats) => {
                          this.currentChats = chats;
                          this.isLoading = false;
                        });
                    }
                  });
              } else {
                console.log('dfsdfds');
                this.currentChats = chats;
              }
            });

          this.chatBotService.emittingAddingMeToOnlineUsers(user); //Thêm user vào onlineUser
          this.chatBotService.onGettingOnlineUsers(); //Lấy list các user đang online trong chats
          this.chatBotService.getSeeContactList //true: Đang ở contact list, false: đang ở chatBot
            .pipe(takeUntil(this.$destroy))
            .subscribe((see) => {
              this.seeContactList = see;
            });

          //Mở đóng chatBot tự động
          this.chatBotService.getChatBotMenuOpened
            .pipe(takeUntil(this.$destroy))
            .subscribe((opened) => {
              if (opened) {
                this.chatBotManuTrigger.openMenu();
              } else {
                if (this.chatBotManuTrigger.menuClosed) {
                  this.chatBotManuTrigger.closeMenu();
                }
              }
            });

          //Lấy số lượng các msg chưa đọc
          this.chatBotService.getTotalUnreadMessages.subscribe((totalMsg) => {
            if (totalMsg >= 0) {
              this.totalUnreadMsgs = totalMsg;
              console.log(
                '🚀 ~ ChatBotComponent ~ .subscribe ~ this.totalUnreadMsgs:',
                this.totalUnreadMsgs
              );
            }
          });

          //Lấy unreaded msg của các chat nếu có
          this.chatBotService.onGettingUnreadMessage();
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  toChatBot(chat: UserChatsType) {
    this.chatBotService.setSeeContactList(false);
    this.chatBotService
      .fetchCurrentChat(chat.members[0], chat.members[1])
      .pipe(takeUntil(this.$destroy))
      .subscribe();
  }
}
