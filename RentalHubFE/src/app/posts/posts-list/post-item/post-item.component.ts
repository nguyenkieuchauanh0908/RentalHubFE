import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItem } from './post-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {}
  ngOnInit() {}

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
