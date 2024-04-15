import { Component, Input, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [MatIconModule, CommonModule],
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() post!: PostItem;
  @Input() isFavoured: boolean | null = null;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private postService: PostService
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

  addOrRemovePostToFavorites() {
    this.isFavoured = !this.isFavoured;
    this.postService.createFavorite(this.post._id).subscribe(
      (res) => {
        if (res.data) {
          if (this.isFavoured) {
            this.notifierService.notify(
              'success',
              'Thêm bài viết yêu thích thành công!'
            );
          } else {
            this.notifierService.notify(
              'success',
              'Bỏ yêu thích bài viết thành công!'
            );
          }
        }
      },
      (errMsg) => {
        this.notifierService.notify(
          'error',
          'Đã có lỗi xảy ra, chúng tôi sẽ sớm khắc phục!'
        );
      }
    );
  }
}
