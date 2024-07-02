import { Component, OnDestroy, OnInit } from '@angular/core';
import { ForumService } from '../forum.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SocialPostEditDialogComponent } from '../social-post-edit-dialog/social-post-edit-dialog.component';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-forum-sidemenu',
  templateUrl: './forum-sidemenu.component.html',
  styleUrls: ['./forum-sidemenu.component.scss'],
})
export class ForumSidemenuComponent implements OnInit, OnDestroy {
  $destroy: Subject<Boolean> = new Subject();
  currentUser: User | null = null;
  constructor(
    private accountService: AccountService,
    private forumService: ForumService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  openCreateSocialPostDialog() {
    window.scrollTo(0, 0); // Scrolls the page to the top

    const dialogRef = this.dialog.open(SocialPostEditDialogComponent, {
      width: '800px',
    });
  }

  goToSocialProfile() {
    if (this.currentUser) {
      let navigationExtras: NavigationExtras = {
        state: {
          profileName: this.currentUser._fname + this.currentUser._lname,
          profileImage: this.currentUser._avatar,
        },
      };
      this.router.navigate(
        ['/forum/profile', this.currentUser?._id],
        navigationExtras
      );
    }
  }

  goToForumHome() {
    this.router.navigate(['/forum/home']);
  }
}
