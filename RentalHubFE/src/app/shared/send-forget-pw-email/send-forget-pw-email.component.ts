import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-send-forget-pw-email',
  templateUrl: './send-forget-pw-email.component.html',
  styleUrls: ['./send-forget-pw-email.component.scss'],
})
export class SendForgetPwEmailComponent {
  isLoading = false;
  error: string = '';
  sendMail = new EventEmitter();
  closeDialog = new EventEmitter();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; inputLabel: string },
    public dialog: MatDialog,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {}

  saveChanges(form: any) {
    console.log('On saving updates on account details...', form);
    this.isLoading = true;
    this.authService.sendForgetPwMail(form.email).subscribe(
      (res) => {
        if (res.data) {
          this.isLoading = false;
          this.notifierService.notify('success', 'Vui lòng kiểm tra mail!');
        }
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log('Có lỗi xảy ra!');
        this.notifierService.notify('error', errorMsg);
      },
      () => {
        this.closeDialog.emit();
      }
    );
  }
}
