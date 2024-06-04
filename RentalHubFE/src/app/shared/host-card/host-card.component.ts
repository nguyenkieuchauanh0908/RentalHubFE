import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatBotService, UserChatsType } from '../chat-bot/chat-bot.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-host-card',
  templateUrl: './host-card.component.html',
  styleUrls: ['./host-card.component.scss'],
})
export class HostCardComponent implements OnInit, OnDestroy {
  @Input()
  host!: {
    hostId: string;
    fname: string;
    lname: string;
    phone: string;
    avatar: string;
  };

  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;
  $destroy: Subject<boolean> = new Subject<boolean>();
  isAuthenticatedUser: boolean = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private notifier: NotifierService
  ) {}
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.isAuthenticatedUser = !!user;
        if (user) {
          this.currentUser = user;
          this.chatBotService.getCurrentChat
            .pipe(takeUntil(this.$destroy))
            .subscribe((currentChat) => {
              if (currentChat) {
                this.currentChat = currentChat;
              }
            });
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  seeHostProfile() {
    if (this.isAuthenticatedUser) {
      this.router.navigate(['/hosts/post-history', this.host.hostId]);
    } else {
      this.router.navigate(['/auth/login']);
      this.notifier.notify(
        'error',
        'Phiên đăng nhập đã hết, vui lòng đăng nhập để tiếp tục!'
      );
    }
  }
  addToContactAndGoToChatBot() {
    if (this.currentUser && this.host) {
      //Thêm chat mới vào chat's list (nếu chưa có trong chat list); update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
      let updatedChats: UserChatsType[] | null = null;
      this.chatBotService
        .createNewChat(this.currentUser._id, this.host.hostId)
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
