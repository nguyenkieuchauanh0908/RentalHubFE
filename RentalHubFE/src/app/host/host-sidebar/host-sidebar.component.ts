import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import {
  ChatBotService,
  UserChatsType,
} from 'src/app/shared/chat-bot/chat-bot.service';

@Component({
  selector: 'app-host-sidebar',
  templateUrl: './host-sidebar.component.html',
  styleUrls: ['./host-sidebar.component.scss'],
})
export class HostSidebarComponent implements OnInit, OnDestroy {
  @Input() hostProfile: any | undefined;
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;
  $destroy: Subject<boolean> = new Subject<boolean>();
  isAuthenticatedUser: boolean = false;

  constructor(
    private accountService: AccountService,
    private chatBotService: ChatBotService
  ) {}
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.isAuthenticatedUser = !!user;
        this.currentUser = user;
      });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  addToContactAndGoToChatBot() {
    console.log('Open chat bot...', this.currentUser, this.hostProfile.id);
    if (this.currentUser && this.hostProfile.id) {
      let updatedChats: UserChatsType[] | null = null;
      //Thêm chat mới vào chat's list; update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
      this.chatBotService
        .createNewChat(this.currentUser._id, this.hostProfile.id)
        .pipe(takeUntil(this.$destroy))
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
