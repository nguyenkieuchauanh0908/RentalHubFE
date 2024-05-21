import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ChatBotService,
  RecipientType,
  UserChatsType,
  UserOnlineType,
} from '../chat-bot.service';
import { Subject, take, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss'],
})
export class ChatUserComponent implements OnInit, OnDestroy {
  recipienInfo: RecipientType | null = null;
  isOnline: boolean | undefined = false;
  seeContactList: Boolean = false;
  $destroy: Subject<boolean> = new Subject<boolean>();

  @Input({ required: true }) chat!: UserChatsType;
  constructor(
    private chatBotService: ChatBotService,
    private accountService: AccountService
  ) {}
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          //Lấy info người nhận
          let recipientId = this.chat?.members.find((id) => id !== user?._id);
          if (recipientId) {
            this.chatBotService
              .fetchRecipientInfo(recipientId!.toString())
              .subscribe((res) => {
                if (res.data) {
                  this.recipienInfo = res.data;
                  this.chat!.updatedAt = new Date(this.chat.updatedAt);
                }
              });
          }

          //Kiểm tra người nhận có online hay không
          this.chatBotService.getCurrentOnlineUsers
            .pipe(takeUntil(this.$destroy))
            .subscribe((onlUsers) => {
              this.isOnline = onlUsers?.some(
                (u: UserOnlineType) => u?.userId === recipientId
              );
            });
          this.chatBotService.getSeeContactList
            .pipe(takeUntil(this.$destroy))
            .subscribe((see) => {
              this.seeContactList = see;
            });
        }
      });
  }
}
