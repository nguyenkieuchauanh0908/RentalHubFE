import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss'],
})
export class PaymentOptionComponent implements OnInit, OnDestroy {
  @Input() option: any = null;
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  $destroy: Subject<boolean> = new Subject();

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }
  goToPaymentPage() {}

  backToHomePage() {
    this.router.navigate(['']);
  }
}
