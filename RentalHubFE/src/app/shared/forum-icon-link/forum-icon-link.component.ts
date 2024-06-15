import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';

@Component({
  selector: 'app-forum-icon-link',
  templateUrl: './forum-icon-link.component.html',
  styleUrls: ['./forum-icon-link.component.scss'],
})
export class ForumIconLinkComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  isAuthenticated: boolean = false;
  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(false);
    this.$destroy.unsubscribe();
  }

  goToForum() {
    if (this.isAuthenticated) {
      this.router.navigate(['/forum/home']);
    }
  }
}
