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
  currentUid!: string | null;
  seeMyProfile = true;
  profile!: User | null;
  myProfile!: User | null;

  constructor(
    private accountService: AccountService,
    private curentRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.myProfileSub = this.accountService.getCurrentUser.subscribe(
      (myProfile) => {
        this.myProfile = myProfile;
      }
    );
    this.currentUid = this.accountService.getCurrentUserId(this.curentRoute);
    console.log(
      '🚀 ~ file: accounts.component.ts:33 ~ AccountsComponent ~ ngOnInit ~ this.currentUid:',
      this.currentUid
    );
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
      // this.seeMyProfile = !!(this.profile?._id === this.myProfile?._id);
    }
    // if (this.currentUid) {
    //   this.getProfileSub = this.accountService
    //     .getProfile(this.currentUid)
    //     .subscribe((profile) => {
    //       this.profile = profile.data;
    //       this.seeMyProfile = !!(this.profile?._id === this.myProfile?._id);
    //       console.log('Current profile to display: ', this.profile);
    //       console.log('Am I seeing my profile: ', this.seeMyProfile);
    //     });
    // }
  }

  ngOnDestroy() {
    // this.myProfileSub.unsubscribe();
    // this.getProfileSub.unsubscribe();
  }
}
