import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { resDataDTO } from '../resDataDTO';
import { handleError } from '../handle-errors';
import { BehaviorSubject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private currentNotifications = new BehaviorSubject<any[]>([]);
  getCurrentNotifications = this.currentNotifications.asObservable();
  setCurrentNotifications(updatedNotifications: any[]) {
    this.currentNotifications.next(updatedNotifications);
  }

  private totalNotifications = new BehaviorSubject<number>(0);
  getTotalNotifications = this.totalNotifications.asObservable();
  setTotalNotifications(total: number) {
    this.totalNotifications.next(total);
  }

  constructor(private http: HttpClient) {}

  getPostNotifications() {
    return this.http.get<resDataDTO>(environment.baseUrl + 'notification').pipe(
      catchError(handleError),
      tap((res) => {
        if (res.data) {
          console.log('Getting notifications successfully!', res.data);
          this.setCurrentNotifications(res.data.notifications);
          this.setTotalNotifications(res.data.totalNewNotification);
        }
      })
    );
  }
}
