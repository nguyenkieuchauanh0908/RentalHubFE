import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { resDataDTO } from '../resDataDTO';
import { handleError } from '../handle-errors';
import { BehaviorSubject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private currentSeenNoti = new BehaviorSubject<any[]>([]);
  getCurrentSeenNotifications = this.currentSeenNoti.asObservable();
  setCurrentSeenNotifications(updatedNotifications: any[]) {
    this.currentSeenNoti.next(updatedNotifications);
  }

  private totalNotifications = new BehaviorSubject<number>(0);
  getTotalNotifications = this.totalNotifications.asObservable();
  setTotalNotifications(total: number) {
    this.totalNotifications.next(total);
  }

  private currentUnseenNotifications = new BehaviorSubject<any[]>([]);
  getCurrentUnseenNotifications =
    this.currentUnseenNotifications.asObservable();
  setCurrentUnseenNotifications(updatedUnseenNotifications: any[]) {
    this.currentUnseenNotifications.next(updatedUnseenNotifications);
  }
  constructor(private http: HttpClient) {}

  //Lấy seen notification
  getSeenNotifications() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'notification/get-noti-readed')
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Getting seen notifications successfully!', res.data);
            this.setCurrentSeenNotifications(res.data);
          }
        })
      );
  }

  //Lấy unseen notifications
  getUnseenNotifications() {
    return this.http.get<resDataDTO>(environment.baseUrl + 'notification').pipe(
      catchError(handleError),
      tap((res) => {
        if (res.data) {
          console.log(
            'Getting unseen notifications successfully!',
            res.data.notifications
          );
          this.setCurrentUnseenNotifications(res.data.notifications);
          this.setTotalNotifications(res.data.totalNewNotification);
        } else {
          this.setCurrentUnseenNotifications([]);
          this.setTotalNotifications(0);
        }
      })
    );
  }

  markNotiFicationAsReadById(id: string) {
    let queryParam = new HttpParams().append('notiId', id);
    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'notification/read-notification-id',
        {
          params: queryParam,
        }
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          let updatedUnseenNotifications: any[] = [];
          let updatedSeenNotifications: any[] = [];
          let totalNotifications: number = 0;
          if (res.data) {
            this.getCurrentUnseenNotifications.subscribe(
              (unseenNotifications) => {
                if (unseenNotifications) {
                  updatedUnseenNotifications = unseenNotifications.filter(
                    (noti) => {
                      // if (noti._id === id) {
                      //   this.getCurrentSeenNotifications.subscribe(
                      //     (seenNotis) => {
                      //       updatedSeenNotifications = seenNotis;
                      //     }
                      //   );
                      //   updatedSeenNotifications.unshift(noti);
                      //   this.setCurrentSeenNotifications(
                      //     updatedSeenNotifications
                      //   );
                      // }
                      return noti._id !== id;
                    }
                  );
                }
              }
            );
            console.log(
              '🚀 ~ NotificationService ~ tap ~ updatedUnseenNotifications:',
              updatedUnseenNotifications
            );
            this.setCurrentUnseenNotifications(updatedUnseenNotifications);
            this.getTotalNotifications.subscribe((total) => {
              totalNotifications = total - 1;
            });
            this.setTotalNotifications(totalNotifications);
          }
        })
      );
  }

  markAsReadAll() {
    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'notification/read-all-notification',
        {}
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log(
              'Marking all notifications as read successfully!',
              res.data
            );
            this.setTotalNotifications(0);
            this.setCurrentUnseenNotifications([]);
            this.getCurrentSeenNotifications.subscribe((allNoti) => {
              console.log('🚀 ~ NotificationService ~ tap ~ allNoti:', allNoti);
            });
          }
        })
      );
  }
}
