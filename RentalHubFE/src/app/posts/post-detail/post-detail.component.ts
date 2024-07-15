import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { Tags } from '../../shared/tags/tag.model';
import { Subject, takeUntil } from 'rxjs';
import { PostCardComponent } from '../post-card/post-card.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  imports: [SharedModule, FormsModule, PostCardComponent, GoogleMapsModule],
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('contentToDisplay') contentToDisplay: ElementRef | undefined;
  isLoading = false;
  error: string = '';
  seeMore: boolean = false;
  stateData: any;
  post!: PostItem;
  host: any;
  relatedPosts!: PostItem[];
  id!: string;
  favoredPosts!: String[] | null | any[];
  isFavoured!: boolean;
  $destroy: Subject<boolean> = new Subject<boolean>();
  center: google.maps.LatLngLiteral | null = null;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private router: Router,
    public dialog: MatDialog,
    private geocoder: MapGeocoder
  ) {}
  ngAfterViewInit(): void {
    window.scrollTo(0, 0); // Scrolls the page to the top
    setTimeout(() => this.attachingInnerHtmlContent(), 100);
  }

  ngOnInit() {
    this.center = null;
    this.postService.getCurrentFavoritesId
      .pipe(takeUntil(this.$destroy))
      .subscribe((favourites) => {
        this.favoredPosts = favourites;
      });
    if (this.post && this.favoredPosts) {
      this.isFavoured = this.favoredPosts.some((pid) => pid === this.post._id);
    }
    this.id = '';
    this.relatedPosts = [];
    this.isLoading = true;
    this.route.params
      .pipe(takeUntil(this.$destroy))
      .subscribe((params: Params) => {
        this.id = params['id'];
        this.postService
          .getPostItem(this.id)
          .pipe(takeUntil(this.$destroy))
          .subscribe(
            (res) => {
              this.post = res.data;
              this.geocoder
                .geocode({
                  address: this.post.roomAddress,
                })
                .subscribe(({ results }) => {
                  console.log('Test map', results);
                  if (results.length > 0) {
                    const location: any = results[0].geometry.location;
                    // Render map with obtained coordinates
                    this.center = {
                      lat: location.lat(),
                      lng: location.lng(),
                    };
                  } else {
                    this.notifierService.notify(
                      'warning',
                      'Đã sử dụng hết request trong ngày cho API Map!'
                    );
                  }
                });
              this.route.data
                .pipe(takeUntil(this.$destroy))
                .subscribe((data) => {
                  this.favoredPosts = data['favoritesPosts'];
                  if (this.post && this.favoredPosts) {
                    this.isFavoured = this.favoredPosts.some(
                      (pid) => pid === this.post._id
                    );
                  }
                });

              //Gọi API get related posts
              this.postService
                .getRelatedPosts(this.post._id, 1, 5)
                .pipe(takeUntil(this.$destroy))
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

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  copyURLtoClipboard() {
    let baseURL = 'http://localhost:4200';
    let currentURL: string = baseURL + this.router.url;
    if (currentURL) {
      navigator.clipboard.writeText(currentURL).then(() => {
        this.notifierService.notify('success', 'Đã lưu vào bộ nhớ tạm');
      });
    }
  }

  attachingInnerHtmlContent() {
    if (this.contentToDisplay) {
      this.contentToDisplay.nativeElement.innerHTML = this.post._content;
    } else {
      console.log('contentToDisplay is not ready yet');
      setTimeout(() => this.attachingInnerHtmlContent(), 100);
    }
  }

  addPostToFavorites(postId: String) {
    this.isFavoured = !this.isFavoured;
    this.postService.createFavorite(postId).subscribe(
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

  openReportDialog(postId: String) {
    const dialog = this.dialog.open(ReportDialogComponent, {
      width: '600px',
      data: { postId: postId, postType: 0 },
    });
  }

  toRelatedPosts(tag: Tags) {
    let tags: string[] = [];
    tags.push(tag._id);
    this.postService
      .searchPostByTags(tags, tag._tag, 1, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          this.postService.searchResultsChanged.next([...res.data]);
          console.log('On navigating to search result page...');
          this.router.navigate(
            [
              '/posts/search',
              {
                keyword: tag._tag,
              },
            ],
            {
              state: {
                searchResult: res.data,
                pagination: res.pagination,
                keyword: tag._tag,
              },
            }
          );
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          console.log(this.error);
          this.notifierService.notify('error', errorMsg);
        }
      );
  }

  seeMoreContentClick() {
    this.seeMore = !this.seeMore;
  }
}
