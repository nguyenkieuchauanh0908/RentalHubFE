import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { AccountService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  private myProfileSub!: Subscription;
  private getProfileSub!: Subscription;
  currentUid!: string;
  seeMyProfile = true;
  profile!: User | null;
  myProfile!: User | null;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private curentRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.myProfileSub = this.authService.user.subscribe((myProfile) => {
      this.myProfile = myProfile;
    });
    this.accountService.currentUserId.subscribe((uId) => {
      this.currentUid = uId;
      if (this.currentUid) {
        this.getProfileSub = this.accountService
          .getProfile(this.currentUid)
          .subscribe((profile) => {
            this.profile = profile.data;
            this.seeMyProfile = !!(this.profile?._id === this.myProfile?._id);
            console.log('Current profile to display: ', this.profile);
            console.log('Am I seeing my profile: ', this.seeMyProfile);
          });
      }
    });
  }

  ngOnDestroy() {
    // this.myProfileSub.unsubscribe();
    // this.getProfileSub.unsubscribe();
  }
}
