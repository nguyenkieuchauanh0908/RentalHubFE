import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { PostEditDialogComponent } from '../posting-history/post-edit-dialog/post-edit-dialog.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  private getNotificationsSub!: Subscription;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  notifications: any[] | any = new Array<any>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  isHost: boolean = false;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  previews: string[] = [];
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];
  imageInfos?: Observable<any>;

  sourceTags: Set<Tags> = new Set();
  selectedTags: Set<Tags> = new Set();

  isLoading: boolean = false;

  currentActiveStatus = {
    status: 0, //All posts
    data: this.notifications,
  };

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    // private paginationService: PaginationService,
    public dialog: MatDialog,
    private router: Router,
    private notificationsService: NotificationService
  ) {
    this.isLoading = true;
    this.notifications = [];
    this.currentUid = this.accountService.getCurrentUserId();
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
    this.getNotificationsSub =
      this.notificationsService.getCurrentNotifications.subscribe(
        (notifications) => {
          this.notifications = notifications;
          // this.paginationService.pagination = res.pagination;
          // this.totalPages = res.pagination.total;
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  ngOnInit() {
    this.currentUid = this.accountService.getCurrentUserId();
  }
  ngOnDestroy(): void {
    this.getNotificationsSub.unsubscribe();
  }

  seeNotificationDetail(reportedId: string) {
    this.postService.getReportPostDetails(reportedId).subscribe((res) => {
      const dialogRef = this.dialog.open(PostEditDialogComponent, {
        width: '1000px',
        data: res.data,
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: + $(result)`);
      });
    });
  }

  // changeCurrentPage(position: number) {
  //   this.isLoading = true;
  //   this.notifications = [];
  //   this.currentPage = this.paginationService.pagination.page;
  //   this.currentPage = this.paginationService.navigatePage(
  //     position,
  //     this.currentPage
  //   );
  //   console.log(
  //     '🚀 ~ file: posting-history.component.ts:249 ~ PostingHistoryComponent ~ changeCurrentPage ~ this.currentPage:',
  //     this.currentPage
  //   );
  //   this.getNotificationsSub = this.postService
  //     .getFavorites(this.currentPage, this.pageItemLimit)
  //     .subscribe(
  //       (res) => {
  //         console.log(res.data);
  //         this.notifications = res.data;
  //         this.postService.getCurrentFavorites.subscribe((postingHistory) => {
  //           this.notifications = postingHistory!;
  //         });
  //         this.paginationService.pagination = res.pagination;
  //         this.totalPages = res.pagination.total;
  //         this.isLoading = false;
  //       },
  //       (errorMsg) => {
  //         this.isLoading = false;
  //       }
  //     );
  // }
}
