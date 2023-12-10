import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

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

  private userSub!: Subscription;
  isAuthenticatedUser: boolean = false;

  constructor(private router: Router, private accountService: AccountService) {}
  ngOnInit(): void {
    this.userSub = this.accountService.getCurrentUser.subscribe((user) => {
      this.isAuthenticatedUser = !!user;
      console.log('User is authenticated: ', this.isAuthenticatedUser);
    });
  }
  ngOnDestroy(): void {}

  seeHostProfile() {
    if (this.isAuthenticatedUser) {
      this.router.navigate(['/hosts/post-history', this.host.hostId]);
    } else {
      console.log('You first need to login to perform this action...');
    }
  }
}
