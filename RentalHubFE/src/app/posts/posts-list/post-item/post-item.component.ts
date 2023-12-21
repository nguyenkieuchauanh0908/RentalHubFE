import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItem } from './post-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';

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
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private accountService: AccountService
  ) {}
  ngOnInit() {
    this.isAuthenticated = false;
    this.accountService.getCurrentUser.subscribe((user) => {
      this.isAuthenticated = !!user;
      console.log(
        '🚀 ~ file: post-item.component.ts:32 ~ PostItemComponent ~ this.accountService.getCurrentUser.subscribe ~ this.isAuthenticated:',
        this.isAuthenticated
      );
    });
  }

  ngOnDestroy() {}

  goToPost() {
    if (this.item._id) {
      this.router.navigate(['/posts/', this.item._id]);
    } else {
      this.notifierService.notify(
        'error',
        'Xảy ra lỗi trong quá trình điều hướng!'
      );
    }
  }
}
