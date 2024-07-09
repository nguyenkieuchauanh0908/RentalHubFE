import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs';
import { handleError } from '../shared/handle-errors';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  payByVNPay(uId: string, amountInput: number) {
    return this.http
      .post<resDataDTO>(
        environment.basePaymentAPI + 'order/create_payment_url',
        {
          contentPayment: uId,
          amountInput: amountInput,
        }
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log('🚀 ~ PaymentService ~ tap ~ res:', res);
          window.location.href = res.data;
        })
      );
  }

  getPaymentPackageInfo() {
    //Lấy thông tin của gói đăng và cập nhật lại currentUser
  }
}
