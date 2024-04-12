import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) {}

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
}
