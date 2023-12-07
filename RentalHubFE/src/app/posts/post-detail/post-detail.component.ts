import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: PostItem | undefined;
  host: any;
  relatedPosts!: PostItem[];
  id!: string;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.post = this.postService.getPostItem(this.id);
    });
    this.relatedPosts = this.postService.posts;
    this.host = {
      hostId: this.post?.authorId,
      fname: this.post?.authorFName,
      lname: this.post?.authorLName,
      address: this.post?.addressAuthor,
      phone: this.post?.phoneNumber,
      avatar:
        'https://static.tapchitaichinh.vn/w640/images/upload/hoangthuviet/12172018/084806baoxaydung_image001.jpg',
    };
  }
  ngOnDestroy() {}
}
