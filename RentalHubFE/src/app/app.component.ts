import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Rental Hub';
  isUser = false;
  isHost = false;
  isAdmin = false;
  isInspector = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isUser = this.authService.isUser;
    this.isAdmin = this.authService.isAdmin;
    this.isHost = this.authService.isHost;
    this.isInspector = this.authService.isInspector;
    this.authService.autoLogin();
    initFlowbite();
  }
}
