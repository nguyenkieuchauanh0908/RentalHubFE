import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from '../../auth/user.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss'],
})
export class PaymentOptionComponent implements OnInit, OnDestroy {
  @Input() option: any = null;
  $destroy: Subject<boolean> = new Subject<boolean>();
  currentUser: User | null = null;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private accountService: AccountService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.router.navigate(['']);
          this.notifier.notify('warning', 'Bạn cần đăng nhập để tiếp tục!');
        }
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }
  goToPaymentPage() {
    if (this.currentUser) {
      this.paymentService
        .payByVNPay(this.currentUser._id, this.option.price)
        .subscribe();
    }
  }

  backToHomePage() {
    this.router.navigate(['']);
  }

  customizeOption() {}
}
