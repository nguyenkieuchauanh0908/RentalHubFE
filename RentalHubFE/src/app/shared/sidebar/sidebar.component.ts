import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { resDataDTO } from '../resDataDTO';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private rftoken: string | null | undefined;
  isHost: boolean = false;
  user!: User | null;
  uId = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private curentRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
      // this.isHost = !!user;
      this.isHost = false; //tạm thời
      this.rftoken = user?.RFToken;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  showAccount() {
    this.router.navigate(['/profile/user', this.uId], {
      relativeTo: this.curentRoute,
    });
  }

  logout() {
    let logoutObs: Observable<resDataDTO>;
    logoutObs = this.authService.logout(this.rftoken);
    logoutObs.subscribe((res) => {
      // console.log(res);
    });
  }
}
