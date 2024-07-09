import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  payByVNPay(uId: string, amountInput: number) {
    return this.http.post(
      environment.basePaymentAPI + 'order/create_payment_url',
      {
        contentPayment: uId,
        amountInput: amountInput,
      }
    );
  }

  getPaymentPackageInfo() {
    //Lấy thông tin của gói đăng và cập nhật lại currentUser
  }
}
