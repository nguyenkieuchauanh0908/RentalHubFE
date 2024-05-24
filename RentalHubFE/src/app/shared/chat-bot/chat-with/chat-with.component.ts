import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import 'moment/locale/vi';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-with',
  templateUrl: './chat-with.component.html',
  styleUrls: ['./chat-with.component.scss'],
})
export class ChatWithComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer: ElementRef | undefined;
  isLoading: boolean = false;
  isOnline: boolean | undefined = false;
  currentUser: User | null = null;
  recipientInfor: RecipientType | null = null;
  currentMsgs: MessageType[] | null = null;
  currentChat: UserChatsType | null = null;
  moment!: any;
  seeContactList: Boolean | undefined = false;
  shouldScrollToBottom: Boolean | undefined = true;

  $destroy: Subject<boolean> = new Subject<boolean>();
  constructor(
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked(): void {
    if (!this.seeContactList && this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    // this.$destroy.unsubscribe();
    this.chatBotService.disconnectToSocket();
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.moment = moment;
    this.moment.locale('vn');
    this.seeContactList = false;
    this.shouldScrollToBottom = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          //See contact list
          this.chatBotService.getSeeContactList
            .pipe(takeUntil(this.$destroy))
            .subscribe((see) => {
              if (see) {
                this.seeContactList = see;
              }
            });

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
                            this.isLoading = false;
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
      });
  }

  toContactList() {
    this.chatBotService.setSeeContactList(true);
    this.chatBotService.setCurrentChat(null);
    this.chatBotService.setMessages(null);
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
            .subscribe((res) => {
              if (res.data) {
                this.shouldScrollToBottom = true;
              }
            });
        }
      });
  }

  private scrollToBottom(): void {
    if (this.chatContainer && this.shouldScrollToBottom) {
      try {
        this.renderer.setProperty(
          this.chatContainer.nativeElement,
          'scrollTop',
          this.chatContainer.nativeElement.scrollHeight
        );
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }
}
