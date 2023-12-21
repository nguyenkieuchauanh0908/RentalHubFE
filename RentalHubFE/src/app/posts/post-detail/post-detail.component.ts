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
    this.id = '';
    this.relatedPosts = [];
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(
        '🚀 ~ file: post-detail.component.ts:30 ~ PostDetailComponent ~ this.route.params.subscribe ~ this.id:',
        this.id
      );
      this.postService.getPostItem(this.id).subscribe(
        (res) => {
          this.post = res.data;
          //Gọi API get related posts
          this.postService
            .getRelatedPosts(this.post._id, 1, 5)
            .subscribe((res) => {
              this.relatedPosts = res.data;
            });
          this.host = {
            hostId: this.post?.authorId,
            fname: this.post?.authorFName,
            lname: this.post?.authorLName,
            address: this.post?.addressAuthor,
            phone: this.post?.phoneNumber,
            avatar: this.post?.avatarAuthor,
          };
          console.log(
            '🚀 ~ file: post-detail.component.ts:33 ~ PostDetailComponent ~ this.route.params.subscribe ~ this.host:',
            this.host
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
  }

  ngOnDestroy() {}
}
