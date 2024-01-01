import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-account-edit-dialog',
  templateUrl: './account-edit-dialog.component.html',
  styleUrls: ['./account-edit-dialog.component.scss'],
})
export class AccountEditDialogComponent {
  isLoading = false;
  error: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {
    console.log(this.data);
  }

  saveChanges(form: any) {
    console.log('On saving updates on account details...', form);
    let updatedProfile = {
      _fname: form.fname,
      _lname: form.lname,
      _phone: form.phone,
      _email: form.email,
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận cập nhật thông tin?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.accountService.updateProfile(updatedProfile).subscribe(
        (res) => {
          if (res.data) {
            this.isLoading = false;
            this.notifierService.notify(
              'success',
              'Cập nhật hồ sơ thành công!'
            );
            // this.accountService.setCurrentUser(res.data);
          }
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          console.log(this.error);
          this.notifierService.notify('error', errorMsg);
        }
      );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
