import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ChatBotService,
  MessageType,
  RecipientType,
  UserChatsType,
  UserOnlineType,
} from '../chat-bot.service';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Subject, take, takeUntil } from 'rxjs';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-chat-with',
  templateUrl: './chat-with.component.html',
  styleUrls: ['./chat-with.component.scss'],
})
export class ChatWithComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isOnline: boolean | undefined = false;
  currentUser: User | null = null;
  recipientInfor: RecipientType | null = null;
  currentMsgs: MessageType[] | null = null;
  currentChat: UserChatsType | null = null;
  $destroy: Subject<boolean> = new Subject<boolean>();
  constructor(
    private accountService: AccountService,
    private chatBotService: ChatBotService
  ) {}
  ngOnDestroy(): void {
    // this.$destroy.unsubscribe();
    this.chatBotService.disconnectToSocket();
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          //connect to socket
          this.chatBotService.initiateSocket();

          //Lấy recipientInfo và messages của currentChat
          this.chatBotService.getCurrentChat
            .pipe(takeUntil(this.$destroy))
            .subscribe((currentChat) => {
              if (currentChat) {
                this.currentChat = currentChat;
                let recipientId = this.currentChat.members.find(
                  (id) => id !== user?._id
                );
                //Lấy recipientInfor và kiểm tra xem recipient có info không
                if (recipientId) {
                  this.chatBotService
                    .fetchRecipientInfo(recipientId.toString())
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((res) => {
                      if (res.data) {
                        this.recipientInfor = res.data;
                      }
                    });
                  //Kiểm tra người nhận có online hay không
                  this.chatBotService.getCurrentOnlineUsers
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((onlUsers) => {
                      this.isOnline = onlUsers?.some(
                        (u: UserOnlineType) => u?.userId === recipientId
                      );
                    });
                }

                //Lấy messages của currentChat
                this.chatBotService
                  .fetchMessagesOfAChat(currentChat._id.toString())
                  .subscribe((res) => {
                    if (res.data) {
                      this.isLoading = false;
                      this.chatBotService.getMessages
                        .pipe(takeUntil(this.$destroy))
                        .subscribe((messages) => {
                          if (messages) {
                            this.currentMsgs = messages;
                          }
                        });
                    }
                  });
              }
            });

          //Emit tin nhắn
          this.chatBotService.emitSendingChatMessage(user!._id);

          //Update tin nhắn nhận được
          this.chatBotService.onReceivingChatMessageToUpdate();
        }
        this.isLoading = false;
      });
  }

  toContactList() {
    this.chatBotService.setSeeContactList(true);
    this.chatBotService
      .fetchMyChats(this.currentUser!._id.toString())
      .subscribe();
  }

  sendMsg(form: any) {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (this.currentChat) {
          //Gọi API tạo msg và emit sending msg
          this.chatBotService
            .creatingNewMessage(
              this.currentChat._id.toString(),
              user!._id,
              form.newMsg
            )
            .pipe(takeUntil(this.$destroy))
            .subscribe();
        }
      });
  }
}
