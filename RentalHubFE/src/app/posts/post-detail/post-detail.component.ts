import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { ActivatedRoute, Params } from '@angular/router';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  stateData: any;
  post!: PostItem;
  host: any;
  relatedPosts!: PostItem[];
  id!: string;
  favoredPosts!: String[] | null | any[];
  isFavoured!: boolean;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {
    this.postService.getCurrentFavoritesId.subscribe((favorites) => {
      this.favoredPosts = favorites;
    });
    if (this.post && this.favoredPosts) {
      this.isFavoured = this.favoredPosts.some((pid) => pid === this.post._id);
      console.log(
        '🚀 ~ PostDetailComponent ~ this.route.params.subscribe ~ this.isFavoured:',
        this.isFavoured
      );
    }
    this.id = '';
    this.relatedPosts = [];
    this.isLoading = true;
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.postService.getPostItem(this.id).subscribe(
        (res) => {
          this.post = res.data;
          this.route.data.subscribe((data) => {
            this.favoredPosts = data['favoritesPosts'];
            if (this.post && this.favoredPosts) {
              this.isFavoured = this.favoredPosts.some(
                (pid) => pid === this.post._id
              );
              console.log(
                '🚀 ~ PostDetailComponent ~ this.route.params.subscribe ~ this.isFavoured:',
                this.isFavoured
              );
            }
          });

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
          this.isLoading = false;
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

  addPostToFavorites(postId: String) {
    this.isFavoured = !this.isFavoured;
    this.postService.createFavorite(postId).subscribe();
  }

  openReportDialog(postId: String) {
    const dialog = this.dialog.open(ReportDialogComponent, {
      width: '600px',
      data: postId,
    });
  }
}
