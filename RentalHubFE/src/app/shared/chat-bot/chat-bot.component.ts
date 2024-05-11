import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/accounts/accounts.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit {
  seeContactList = false;
  onChatBot = false;
  isAuthenticated = false;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.isAuthenticated = false;
    this.onChatBot = false;
    this.seeContactList = true;
    this.accountService.getCurrentUser.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  toContactList() {
    this.seeContactList = true;
  }
  toChatBot() {
    this.seeContactList = false;
  }
}
