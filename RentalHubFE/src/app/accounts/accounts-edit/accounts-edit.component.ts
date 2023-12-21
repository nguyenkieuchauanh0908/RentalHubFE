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
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-accounts-edit',
  templateUrl: './accounts-edit.component.html',
  styleUrls: ['./accounts-edit.component.scss'],
})
export class AccountsEditComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  seeMyProfile = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.currentUid = this.accountService.getCurrentUserId();
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
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
    this.accountService.updateProfile(updatedProfile).subscribe(
      (res) => {
        if (res.data) {
          this.notifierService.notify('success', 'Cập nhật hồ sơ thành công!');
        }
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
  }
}
