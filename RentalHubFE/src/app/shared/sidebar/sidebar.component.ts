import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { resDataDTO } from '../resDataDTO';
import { User } from 'src/app/auth/user.model';
import { AccountService } from 'src/app/accounts/accounts.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() profile!: User | null;
  @Input() myProfile!: User | null;
  @Input() seeMyProfile!: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('Am I seeing my profile from sidebar: ', this.seeMyProfile);
  }

  ngOnDestroy() {}

  showAccount() {
    this.router.navigate(['/profile/user', this.myProfile?._id]);
  }

  logout() {
    console.log('On logging out...');
    let logoutObs: Observable<resDataDTO>;
    logoutObs = this.authService.logout(this.myProfile?.RFToken);
    logoutObs.subscribe();
    this.router.navigate(['/posts']);
  }

  toPostingHistory() {
    this.router.navigate(['/profile/posting-history', this.myProfile?._id]);
  }

  toPostNew() {
    this.router.navigate(['/profile/post-new', this.myProfile?._id]);
  }

  editAvatar() {
    this.router.navigate(['/profile/user/edit-avatar', this.myProfile?._id]);
  }
}
