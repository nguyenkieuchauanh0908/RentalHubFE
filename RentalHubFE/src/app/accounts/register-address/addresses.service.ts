import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private currentRegisteredAddresses = new BehaviorSubject<String[] | null>([]);
  getCurrentRegisteredAddress = this.currentRegisteredAddresses.asObservable();

  setcurrentRegisteredAddresses(updatedRegisteredAddresses: String[]) {
    this.currentRegisteredAddresses.next(updatedRegisteredAddresses);
  }

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {}

  registerNewAddress(totalRoom: string, address: string, images: FileList) {
    let body = new FormData();
    body.append('_address', address);
    body.append('_totalRoom', totalRoom);
    const numberOfImages = images.length;
    for (let i = 0; i < numberOfImages; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(images[i]);
      body.append('_licenses', images[i]);
      console.log(
        '🚀 ~ AddressesService ~ registerNewAddress ~ images[i]:',
        images[i]
      );
    }
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/register-address', body)
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res);
        })
      );
  }

  //status: 0-Chờ duyệt; 1-Đã duyệt; 3-Bị từ chối; 4-Host tự khóa lại
  getAddresses(status: number, page: number, limit: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page);
    queryParams = queryParams.append('limit', limit);
    queryParams = queryParams.append('status', status);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'users/get-address-list', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap(
          (res) => {},
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }

  getAddressById(addressId: String) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('addressId', addressId.toString());
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'users/get-address-by-id', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap(
          (res) => {},
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }

  updataAddressStatus(addressId: String, status: number) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-address-status', {
        addressId: addressId,
        status: status,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {})
      );
  }
}
