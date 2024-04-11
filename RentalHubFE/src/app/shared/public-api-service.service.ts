import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { handleError } from './handle-errors';
import { NotifierService } from 'angular-notifier';
import { resDataDTO } from './resDataDTO';
import { ResPublicAPIDataDTO } from './resPublicAPIDataDTO';

@Injectable({
  providedIn: 'root',
})
export class PublicApiServiceService {
  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {}

  getCity(type: number, code: number) {
    console.log('Getting city list...');
    return this.http
      .get<ResPublicAPIDataDTO>(
        'https://esgoo.net/api-tinhthanh/' + type + '/' + code + '/.htm'
      )
      .pipe(
        tap(
          (res) => {},
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }
  getDistrictOfACity(type: '2', cityId: string) {
    console.log('Getting district list...');
    return this.http
      .get<ResPublicAPIDataDTO>(
        'https://esgoo.net/api-tinhthanh/' + type + '/' + cityId + '.htm'
      )
      .pipe(
        tap(
          (res) => {},
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }

  getWardsOfADistrict(type: '3', wardId: string) {
    console.log('Getting ward list...');
    return this.http
      .get<ResPublicAPIDataDTO>(
        'https://esgoo.net/api-tinhthanh/' + type + '/' + wardId + '.htm'
      )
      .pipe(
        tap(
          (res) => {},
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }
}
