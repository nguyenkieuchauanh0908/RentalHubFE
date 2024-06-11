import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ChatBotService,
  MessageType,
  RecipientType,
  UserChatsType,
  UserOnlineType,
} from '../chat-bot.service';
import { AccountService } from 'src/app/accounts/accounts.service';
import {
  Subject,
  Subscription,
  fromEvent,
  take,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { User } from 'src/app/auth/user.model';
import 'moment/locale/vi';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-with',
  templateUrl: './chat-with.component.html',
  styleUrls: ['./chat-with.component.scss'],
})
export class ChatWithComponent implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild('scrollableDiv') scrollableDiv: ElementRef | undefined;
  @ViewChild('chatContainer', { static: false })
  private chatContainer!: ElementRef;
  isLoading: boolean = false;
  initialized: boolean = false;
  isOnline: boolean | undefined = false;
  currentUser: User | null = null;
  recipientInfor: RecipientType | null = null;
  currentMsgs: MessageType[] | null = [];
  currentChat: UserChatsType | null = null;
  moment!: any;
  seeContactList: Boolean | undefined = false;
  shouldScrollToBottom: Boolean | undefined = true;

  currentPage = 1;
  totalPages: number = 0;
  pageMsgLimit: number = 25;
  currentScrollTopPosition: number = -2000;

  $destroy: Subject<boolean> = new Subject<boolean>();
  scrollSubscription: Subscription | undefined;
  constructor(
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    // this.$destroy.next(false);
    this.$destroy.unsubscribe();
    this.chatBotService.destroy();
    this.scrollSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    console.log('ChatMessagesComponent ngAfterViewInit');
    setTimeout(() => {
      this.initializeScrollEvent();
    }, 100);
  }

  initializeScrollEvent() {
    if (this.chatContainer) {
      console.log('Chat container is ready');
      this.attachScrollEvent();
    } else {
      console.error('Chat container is still not ready');
      // Retry attaching the event after a slight delay
      setTimeout(() => this.initializeScrollEvent(), 100);
    }
  }

  ngOnInit(): void {
    console.log('ChatMessagesComponent ngOnInit');
    this.isLoading = true;
    this.initialized = false;
    this.currentPage = 1;
    this.totalPages = 0;
    this.currentScrollTopPosition = -2000;
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
          // this.chatBotService.initiateSocket();
          //Lấy recipientInfo và messages của currentChat
          console.log('Initializing chat');
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
                  .fetchMessagesOfAChatWithPagination(
                    this.currentChat._id.toString(),
                    this.currentPage,
                    this.pageMsgLimit
                  )
                  .pipe(takeUntil(this.$destroy))
                  .subscribe(
                    (res) => {
                      if (res.data) {
                        this.isLoading = false;
                        this.totalPages = res.pagination.total;
                        if (res.data) {
                          let messages = null;
                          this.chatBotService.getMessages
                            .pipe(takeUntil(this.$destroy))
                            .subscribe((msgs) => {
                              messages = msgs;
                              this.currentMsgs = messages;
                            });
                          if (messages) {
                            this.chatBotService.setMessages([
                              ...messages,
                              ...res.data,
                            ]);
                            // this.currentMsgs = [...messages, ...res.data];
                          } else {
                            this.chatBotService.setMessages([...res.data]);
                            // this.currentMsgs = [...res.data];
                          }
                        }
                      }
                    },
                    (err) => {
                      this.chatBotService.setMessages([]);
                      this.currentMsgs = [];
                      this.chatBotService.getMessages
                        .pipe(takeUntil(this.$destroy))
                        .subscribe((msgs) => {
                          this.currentMsgs = msgs;
                        });
                      this.isLoading = false;
                    }
                  );
              }
              this.initialized = true;
            });

          //Emit tin nhắn
          this.chatBotService.emitSendingChatMessage(user!._id);
          //Update tin nhắn nhận được
          // this.chatBotService.onReceivingChatMessageToUpdate();
        }
      });
  }

  toContactList() {
    this.chatBotService.setSeeContactList(true);
    this.chatBotService.setCurrentChat(null);
    this.chatBotService.setMessages(null);
    this.chatBotService.setNewMessage(null);
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
                // this.currentMsgs?.unshift(res.data);
                // this.shouldScrollToBottom = true;
              }
            });
        }
      });
  }

  loadMessages() {
    if (this.isLoading) return;
    this.isLoading = true;
    //Lấy recipientInfo và messages của currentChat

    if (this.currentChat && this.initialized) {
      //Lấy messages của currentChat
      this.chatBotService
        .fetchMessagesOfAChatWithPagination(
          this.currentChat._id.toString(),
          this.currentPage,
          this.pageMsgLimit
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.isLoading = false;
            if (this.totalPages > this.currentPage) {
              this.totalPages = res.pagination.total;
            } else {
              this.totalPages = 0;
              this.currentPage = 1;
            }

            if (res.data) {
              let messages = null;
              this.chatBotService.getMessages.subscribe((msgs) => {
                messages = msgs;
                this.currentMsgs = messages;
              });
              if (messages) {
                this.chatBotService.setMessages([...messages, ...res.data]);
                this.currentMsgs = [...messages, ...res.data];
                setTimeout(() => {
                  if (this.currentPage < this.totalPages) {
                    console.log('Maintain scroll position');
                    this.renderer.setProperty(
                      this.chatContainer.nativeElement,
                      'scrollTop',
                      this.currentScrollTopPosition
                    );
                    this.currentScrollTopPosition =
                      this.chatContainer.nativeElement.scrollTop - 2000;
                  }
                }, 100);
              } else {
                this.chatBotService.setMessages([...res.data]);
                this.currentMsgs = [...res.data];
              }
            }
          }
        });
    }
  }

  attachScrollEvent() {
    console.log(' before attachScrollEvent');
    if (this.chatContainer) {
      console.log('Attaching scroll event listener');
      this.scrollSubscription = fromEvent(
        this.chatContainer.nativeElement,
        'scroll'
      )
        .pipe(throttleTime(200))
        .subscribe(() => this.onScroll());
    }
  }

  onScroll() {
    console.log('Scroll event detected');
    const element = this.chatContainer!.nativeElement;
    console.log(
      '🚀 ~ onScroll ~ element:',
      element.scrollTop,
      this.currentScrollTopPosition
    );
    if (
      element.scrollTop <= this.currentScrollTopPosition &&
      !this.isLoading &&
      this.currentPage < this.totalPages
    ) {
      console.log(
        'User is scrolling to the top with chat ID:',
        this.currentChat?._id
      );

      this.currentPage++;
      if (this.initialized) {
        this.loadMessages();
      }
    }
  }
}
