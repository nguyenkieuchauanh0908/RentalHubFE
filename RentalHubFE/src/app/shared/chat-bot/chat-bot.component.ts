import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ChatBotService, UserChatsType } from './chat-bot.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit, OnDestroy {
  seeContactList: Boolean = false;
  onChatBot = false;
  isAuthenticated = false;
  currentUser: User | null = null;
  currentChats: UserChatsType[] | null = null;

  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private chatBotService: ChatBotService
  ) {}
  ngOnInit(): void {
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
          this.chatBotService
            .fetchMyChats(user._id)
            .pipe(takeUntil(this.$destroy))
            .subscribe((res) => {
              if (res.data) {
                this.chatBotService.getCurrentUserChats
                  .pipe(takeUntil(this.$destroy))
                  .subscribe((chats) => {
                    this.currentChats = chats;
                  });
              }
            });

          this.chatBotService.emittingAddingMeToOnlineUsers(user._id); //Thêm user vào onlineUser
          this.chatBotService.onGettingOnlineUsers(); //Lấy list các user đang online trong chats
          this.chatBotService.getSeeContactList
            .pipe(takeUntil(this.$destroy))
            .subscribe((see) => {
              this.seeContactList = see;
            });
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
