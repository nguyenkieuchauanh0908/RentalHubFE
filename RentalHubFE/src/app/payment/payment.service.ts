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
          if (res.data) {
            window.location.href = res.data;
          }
        })
      );
  }

  getPaymentPackageInfo() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'users/get-packages-user')
      .pipe(catchError(handleError));
  }
}
