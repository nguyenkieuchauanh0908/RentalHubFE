import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment-packages',
  templateUrl: './payment-packages.component.html',
  styleUrls: ['./payment-packages.component.scss'],
})
export class PaymentPackagesComponent implements OnInit, OnDestroy {
  paymentOptions: any | null;
  $destroy: Subject<boolean> = new Subject();
  constructor(private paymentService: PaymentService) {}

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.paymentOptions = [
      {
        name: 'Cơ bản',
        price: 0,
        turns: 5,
        sale_off: null,
        desc: 'Miễn phí 5 lượt đăng bài cho tất cả chủ trọ kích hoạt lần đầu. Không giới hạn thời gian sử dụng! (Chỉ chấp nhấp thanh toán qua VNPay)',
      },
      {
        name: 'VIP20',
        price: 100000,
        turns: 20,
        sale_off: 20,
        desc: '20 lượt đăng bài cho chủ trọ khi mua gói. Không giới hạn thời gian sử dụng!  (Chỉ chấp nhấp thanh toán qua VNPay)',
      },
      {
        name: 'VIP50',
        price: 200000,
        turns: 50,
        sale_off: 20,
        desc: 'Ưu đãi 20% so với giá gốc. 50 lượt đăng bài cho chủ trọ. Không giới hạn thời gian sử dụng! (Chỉ chấp nhấp thanh toán qua VNPay)',
      },
      {
        name: 'GOD',
        price: 'Tùy chỉnh',
        turns: 'Tùy chỉnh',
        sale_off: 30,
        desc: 'Uư đãi 30% so với giá gốc. Tùy chỉnh lượt mua theo nhu cầu. Không giới hạn thời gian sử dụng!  (Chỉ chấp nhấp thanh toán qua VNPay)',
      },
    ];
  }
}
