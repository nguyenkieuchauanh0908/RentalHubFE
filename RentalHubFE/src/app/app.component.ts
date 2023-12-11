import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { initFlowbite } from 'flowbite';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Rental Hub';
  isUser = false;
  isHost = false;

  constructor(
    private authService: AuthService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.isUser = this.authService.isUser;
    this.isHost = this.authService.isHost;
    this.authService.autoLogin();
    initFlowbite();
  }
}
