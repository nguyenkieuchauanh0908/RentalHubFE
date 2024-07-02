import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItem } from './post-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit, OnDestroy {
  @Input()
  item!: PostItem;
  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private accountService: AccountService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.isAuthenticated = false;
    this.accountService.getCurrentUser.subscribe((user) => {
      this.isAuthenticated = !!user;
      // console.log(
      //   '🚀 ~ file: post-item.component.ts:32 ~ PostItemComponent ~ this.accountService.getCurrentUser.subscribe ~ this.isAuthenticated:',
      //   this.isAuthenticated
      // );
    });
  }

  ngOnDestroy() {}

  goToPost() {
    if (this.item._id) {
      if (this.isAuthenticated) {
        this.router.navigate(['/posts/', this.item._id]);
      } else {
        window.scrollTo(0, 0); // Scrolls the page to the top

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          data: 'Bạn cần phải đăng nhập để tiếp tục!',
        });
        const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      }
    } else {
      this.notifierService.notify(
        'error',
        'Xảy ra lỗi trong quá trình điều hướng!'
      );
    }
  }
}
