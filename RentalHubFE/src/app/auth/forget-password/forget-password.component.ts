import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { NgMaterialsModule } from 'src/app/shared/ng-materials/ng-materials.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  imports: [
    NgMaterialsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NotifierModule,
  ],
})
export class ForgetPasswordComponent {
  resetPwObs!: Observable<resDataDTO>;
  password: string = 'password';
  confirmPassword: string = 'password';
  isPwShown: boolean = false;
  isConfirmPwShown: boolean = false;
  isLoading = false;
  error: string = '';
  forgetPassEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.password = 'password';
  }

  ngOnDestroy(): void {}

  onSubmit(form: NgForm) {
    console.log('🚀 ~ ForgetPasswordComponent ~ onSubmit ~ form:', form.value);
    if (!form.valid) {
      return;
    }
    const pw = form.value.password;
    const pw_confirm = form.value.pw_confirm;
    const uId = this.activatedRoute.snapshot.url[1].path;
    const ressetPassToken = this.activatedRoute.snapshot.url[2].path;

    this.resetPwObs = this.authService.resetPassword(
      pw,
      pw_confirm,
      uId,
      ressetPassToken
    );

    this.isLoading = true;
    this.notifierService.hideAll();
    this.resetPwObs.subscribe(
      (res) => {
        this.notifierService.notify('success', 'Đổi mật khẩu thành công!');
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
  }

  onEyesSeePwClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.isPwShown = true;
    } else {
      this.password = 'password';
      this.isPwShown = false;
    }
  }

  onEyesSeeConfirmPwClick() {
    if (this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.isConfirmPwShown = true;
    } else {
      this.confirmPassword = 'password';
      this.isConfirmPwShown = false;
    }
  }
}
