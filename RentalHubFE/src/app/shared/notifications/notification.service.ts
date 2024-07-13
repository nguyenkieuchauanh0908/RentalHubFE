import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { resDataDTO } from '../resDataDTO';
import { handleError } from '../handle-errors';
import { BehaviorSubject, Subject, Subscription, catchError, tap } from 'rxjs';
import { ChatBotService } from '../chat-bot/chat-bot.service';
import { Notification } from './notification.model';
import { Pagination } from '../pagination/pagination.service';
import { User } from 'src/app/auth/user.model';
import { AccountService } from 'src/app/accounts/accounts.service';

export interface SocketNotification {
  _uId: string;
  _postId: string; //optional
  _addressId: string; //optional
  _title: string;
  _message: string;
  _read: boolean;
  _type: string;
  _recipientRole: number;
  _recipientId: string;
  _address: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private currentSeenNoti = new BehaviorSubject<any[]>([]);
  getCurrentSeenNotifications = this.currentSeenNoti.asObservable();
  setCurrentSeenNotifications(updatedNotifications: any[]) {
    this.currentSeenNoti.next(updatedNotifications);
  }
  private seenNotificationsPagination = new BehaviorSubject<any>({
    page: 0,
    total: 1,
    limit: 10,
  });
  getSeenNotificationsPagination =
    this.seenNotificationsPagination.asObservable();
  updateSeenNotificationsPagination(updatedPagination: any[]) {
    this.seenNotificationsPagination.next(updatedPagination);
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

  private unseenNotificationsPagination = new BehaviorSubject<any>({
    page: 0,
    total: 1,
    limit: 10,
  });
  getUnseenNotificationspagination =
    this.unseenNotificationsPagination.asObservable();
  updateUnseenNotificationsPagination(updatedPagination: any) {
    this.unseenNotificationsPagination.next(updatedPagination);
  }

  private subscriptions: Subscription[] = [];
  constructor(
    private http: HttpClient,
    private chatService: ChatBotService,
    private accountService: AccountService
  ) {
    this.onReceivingNewNotificationToUpdate();
  }

  //destroy
  destroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    console.log(
      'destroying subscription of noti service!',
      this.subscriptions.length
    );
  }

  //Lấy seen notification
  getSeenNotifications(page: number, limit: number) {
    let queryParam = new HttpParams()
      .append('limit', limit)
      .append('page', page);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'notification/get-noti-readed', {
        params: queryParam,
      })
      .pipe(
        catchError(handleError),
        tap(
          (res) => {
            if (res.pagination) {
              this.updateSeenNotificationsPagination(res.pagination);
            }
            if (res.data) {
              console.log('Getting seen notifications successfully!', res.data);
              let seenNoti: any[] = [];
              let seenNotiSub = this.getCurrentSeenNotifications.subscribe(
                (notis) => {
                  seenNoti = notis;
                }
              );
              if (seenNoti) {
                this.setCurrentSeenNotifications(seenNoti.concat(res.data));
              } else {
                this.setCurrentSeenNotifications(res.data);
              }
              this.subscriptions.push(seenNotiSub);
            } else {
              this.setCurrentUnseenNotifications([]);
            }
          },
          (err) => {
            this.setCurrentSeenNotifications([]);
          }
        )
      );
  }

  //Lấy unseen notifications
  getUnseenNotifications(page: number, limit: number) {
    let queryParam = new HttpParams()
      .append('limit', limit)
      .append('page', page);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'notification', {
        params: queryParam,
      })
      .pipe(
        catchError(handleError),
        tap(
          (res) => {
            if (res.pagination) {
              this.updateUnseenNotificationsPagination(res.pagination);
            }
            if (res.data) {
              console.log(
                'Getting unseen notifications successfully!',
                res.data.notifications
              );
              let unseenNoti: any[] = [];
              let unseenNotiSub = this.getCurrentUnseenNotifications.subscribe(
                (notis) => {
                  unseenNoti = notis;
                }
              );
              if (unseenNoti) {
                this.setCurrentUnseenNotifications(
                  unseenNoti.concat(res.data.notifications)
                );
              } else {
                this.setCurrentUnseenNotifications(res.data.notifications);
              }
              this.setTotalNotifications(res.data.totalNewNotification);
              this.subscriptions.push(unseenNotiSub);
            } else {
              this.setCurrentUnseenNotifications([]);
              this.setTotalNotifications(0);
            }
          },
          (err) => {
            this.setCurrentUnseenNotifications([]);
            this.setTotalNotifications(0);
          }
        )
      );
  }

  //Đánh dấu đã đọc theo id
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
            //Xóa noti ra khỏi list unseenNotifications
            let thisNoti: any | null = null;
            this.getCurrentUnseenNotifications.subscribe(
              (unseenNotifications) => {
                if (unseenNotifications) {
                  //Lưu lại noti được đánh dấu đọc thành công
                  for (let i = 0; i < unseenNotifications.length; i++) {
                    if (unseenNotifications[i]._id === id) {
                      thisNoti = unseenNotifications[i];
                      thisNoti._read = true;
                      break;
                    }
                  }
                  //Lọc noti đã đánh dấu đọc ra khỏi list unseenNotifications
                  updatedUnseenNotifications = unseenNotifications.filter(
                    (noti) => {
                      return noti._id !== id;
                    }
                  );
                }
              }
            );
            this.setCurrentUnseenNotifications(updatedUnseenNotifications);

            //Thêm noti vào list seenNotifications
            this.getCurrentSeenNotifications.subscribe((seenNotis) => {
              updatedSeenNotifications = seenNotis;
            });
            updatedSeenNotifications.push(thisNoti);
            this.setCurrentSeenNotifications(updatedSeenNotifications);

            //Cập nhật lại tổng số noti unseen
            this.getTotalNotifications.subscribe((total) => {
              totalNotifications = total - 1;
            });
            this.setTotalNotifications(totalNotifications);
            console.log(
              '🚀 ~ NotificationService ~ tap ~ updatedUnseenNotifications, updatedSeenNotifications:',
              updatedUnseenNotifications,
              updatedSeenNotifications
            );
          }
        })
      );
  }

  //Đánh dấu đã đọc toàn bộ
  markAsReadAll() {
    return this.http
      .get<resDataDTO>(
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

  //Socket event's name: getNotification
  onReceivingNewNotificationToUpdate = () => {
    console.log('Receiving new noti...');
    let newNotiComing: Notification | null = null;
    let unseenNotificaionList: Notification[] | null = null;
    let totalNotisUnseen: number = 0;
    let socketSub = this.chatService.getCurrentSocket.subscribe((socket) => {
      if (socket) {
        socket.on('getNotification', (noti: SocketNotification) => {
          console.log('🚀 ~ NotificationService ~ socket.on ~ noti:', noti);
          newNotiComing = {
            _id: noti._uId,
            _uId: noti._uId,
            _postId: noti._postId,
            _title: noti._title,
            _message: noti._message,
            _read: noti._read,
            _type: noti._type,
            _address: noti._address,
          };
          //Thêm newNotiComing vào unseenNotificaionList và lưu lại
          let unseenNotiSub = this.getCurrentUnseenNotifications.subscribe(
            (unseenNotis: any[]) => {
              unseenNotificaionList = unseenNotis;
            }
          );

          if (newNotiComing) {
            if (newNotiComing._type === 'ACTIVE_HOST_SUCCESS') {
              console.log('ACTIVE_HOST_SUCCESS');
              let user!: User;
              let userSub = this.accountService.getCurrentUser.subscribe(
                (u) => {
                  if (u) {
                    user = u;
                  }
                }
              );
              if (user) {
                user._isHost = true;
                this.accountService.setCurrentUser(user);
                localStorage.setItem('userData', JSON.stringify(user));
              }
              this.subscriptions.push(userSub);
            }
            if (newNotiComing._type === 'REGISTER_ADDRESS_SUCCESS') {
              let user!: User;
              let userSub = this.accountService.getCurrentUser.subscribe(
                (u) => {
                  if (u) {
                    user = u;
                  }
                }
              );
              if (user) {
                user._addressRental.push(noti._address);
                this.accountService.setCurrentUser(user);
                localStorage.setItem('userData', JSON.stringify(user));
              }
              this.subscriptions.push(userSub);
            }
            if (unseenNotificaionList) {
              unseenNotificaionList.unshift(newNotiComing);
            } else {
              unseenNotificaionList = [newNotiComing];
            }
            console.log(
              '🚀 ~ NotificationService ~ socket.on ~ unseenNotificaionList:',
              unseenNotificaionList
            );
          }

          this.setCurrentUnseenNotifications(unseenNotificaionList!);
          let totalNotiSub = this.getTotalNotifications.subscribe(
            (unseenNotificaionList) => {
              totalNotisUnseen = unseenNotificaionList;
            }
          );
          this.setTotalNotifications(totalNotisUnseen + 1);
          this.subscriptions.push(socketSub);
          this.subscriptions.push(unseenNotiSub);
          this.subscriptions.push(totalNotiSub);
        });
      }
    });
  };
}
