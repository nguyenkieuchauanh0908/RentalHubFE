import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  stateData: any;
  post: PostItem | undefined | any;
  host: any;
  relatedPosts!: PostItem[];
  id!: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.postService.getPostItem(this.id).subscribe(
        (res) => {
          this.post = res.data;
          this.host = {
            hostId: this.post?.authorId,
            fname: this.post?.authorFName,
            lname: this.post?.authorLName,
            address: this.post?.addressAuthor,
            phone: this.post?.phoneNumber,
            avatar:
              'https://static.tapchitaichinh.vn/w640/images/upload/hoangthuviet/12172018/084806baoxaydung_image001.jpg',
          };
          console.log(
            '🚀 ~ file: post-detail.component.ts:23 ~ PostDetailComponent ~ this.post:',
            this.post
          );
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          console.log(this.error);
          this.notifierService.notify('error', errorMsg);
        }
      );
    });
    //Gọi API get related posts
    this.relatedPosts = this.postService.posts;
  }
  ngOnDestroy() {}
}
