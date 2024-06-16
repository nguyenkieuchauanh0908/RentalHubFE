import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { ForumService } from '../forum.service';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss'],
})
export class ForumPostComponent implements OnInit, OnDestroy {
  @Input() post: any;
  $destroy: Subject<Boolean> = new Subject();
  isAuthenticated: boolean = false;
  seeMore: boolean = false;

  constructor(public dialog: MatDialog, private router: Router) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(false);
    this.$destroy.unsubscribe();
  }

  seeMoreContentClick() {
    this.seeMore = !this.seeMore;
  }

  seeComments() {
    if (this.isAuthenticated) {
      //Load comments
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: 'Bạn cần phải đăng nhập để bình luận',
      });
      const sub = dialogRef.componentInstance.confirmYes
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => {
          sub.unsubscribe();
        });
    }
  }
}
