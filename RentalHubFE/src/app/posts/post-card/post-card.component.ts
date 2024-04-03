import { Component, Input, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  standalone: true,
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() post!: PostItem;

  constructor(
    private router: Router,
    private notifierService: NotifierService
  ) {}

  goToPost() {
    if (this.post._id) {
      this.router.navigate(['/posts/', this.post._id]).then(() => {
        window.location.reload();
      });
    } else {
      this.notifierService.notify(
        'error',
        'Có lỗi xảy ra trong quá trình điều hướng!'
      );
    }
  }
}
