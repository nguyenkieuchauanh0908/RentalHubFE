import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ForumService } from '../forum.service';

@Component({
  selector: 'app-forum-home',
  templateUrl: './forum-home.component.html',
  styleUrls: ['./forum-home.component.scss'],
})
export class ForumHomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  $destroy: Subject<Boolean> = new Subject();
  isAuthenticated: boolean = false;
  socialPostsToDisplay: any[] | null = null;
  currentPage: number = 1;
  pageLimit: number = 5;
  currentPostStatus: number | null = null;

  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.router.events
      .pipe(
        takeUntil(this.$destroy),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        console.log('Navigation event:', event);
      });
  }
  ngOnInit(): void {
    console.log('ngOnInit called');
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('Authentication status checked');
        this.isAuthenticated = !!user;
        if (this.isAuthenticated) {
          console.log('User is authenticated');
          this.forumService
            .getSocialPosts(
              this.currentPage,
              this.pageLimit,
              this.currentPostStatus
            )
            .pipe(takeUntil(this.$destroy))
            .subscribe((res) => {
              if (res.data) {
                if (!this.socialPostsToDisplay) {
                  this.socialPostsToDisplay = res.data;
                } else {
                  this.socialPostsToDisplay.push(res.data);
                }
              }
            });
        }
      });
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(false);
    this.$destroy.unsubscribe();
  }
}
