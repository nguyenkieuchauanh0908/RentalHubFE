import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatBotService, UserChatsType } from '../chat-bot/chat-bot.service';

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
    private chatBotService: ChatBotService
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
      console.log('You first need to login to perform this action...');
    }
  }
  addToContactAndGoToChatBot() {
    if (this.currentUser && this.host) {
      //Thêm chat mới vào chat's list; update lại currentChat; cập nhật lại trạng thái của chatBotMenu
      this.chatBotService
        .createNewChat(this.currentUser._id, this.host.hostId)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.chatBotService.setChatBotMenuOpened(true);
            this.chatBotService.setSeeContactList(false);
            this.chatBotService.setCurrentChat(res.data);
            if (this.currentChat) {
              this.chatBotService
                .fetchMessagesOfAChat(this.currentChat._id.toString())
                .subscribe();
            }
          }
        });
    }
  }
}
