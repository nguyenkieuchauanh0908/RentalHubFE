import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { AccountService } from '../accounts.service';

@Component({
  selector: 'app-accounts-edit',
  templateUrl: './accounts-edit.component.html',
  styleUrls: ['./accounts-edit.component.scss'],
})
export class AccountsEditComponent implements OnInit, OnDestroy {
  private myProfileSub!: Subscription;
  private getProfileSub!: Subscription;
  profile!: User | null;
  currentUid!: string;
  myProfile!: User | null;
  seeMyProfile = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.accountService.currentUserId.subscribe((uId) => {
      this.currentUid = uId;
      if (this.currentUid) {
        this.getProfileSub = this.accountService
          .getProfile(this.currentUid)
          .subscribe((profile) => {
            this.profile = profile.data;
            this.seeMyProfile = !!(this.profile?._id === this.myProfile?._id);
          });
      }
    });
  }

  ngOnInit() {
    this.myProfileSub = this.authService.user.subscribe((myProfile) => {
      this.myProfile = myProfile;
    });
    this.accountService.getCurrentUserId(this.route);
  }
  ngOnDestroy(): void {
    // this.myProfileSub.unsubscribe();
    // this.getProfileSub.unsubscribe();
  }

  onSubmitProfile(form: any) {
    console.log('On saving updated profile...', form);
    let updatedProfile = {
      _fname: form.first_name,
      _lname: form.last_name,
      _dob: form.dob,
      _phone: form.phone,
      _email: form.email,
    };
    this.accountService.updateProfile(updatedProfile).subscribe((res) => {
      console.log(res);
    });
  }
}
