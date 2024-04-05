import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
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

@Component({
  standalone: true,
  imports: [SharedModule, FormsModule, PostCardComponent, GoogleMapsModule],
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
  $destroy: Subject<boolean> = new Subject<boolean>();
  center!: google.maps.LatLngLiteral;
  latitudeVariable!: number;
  longitudeVariable!: number;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private router: Router,
    public dialog: MatDialog,
    private geocoder: MapGeocoder
  ) {
    this.postService.getCurrentFavoritesId.subscribe((favorites) => {
      this.favoredPosts = favorites;
    });
    if (this.post && this.favoredPosts) {
      this.isFavoured = this.favoredPosts.some((pid) => pid === this.post._id);
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
          // this.geocoder
          //   .geocode({
          //     address: this.post.roomAddress,
          //   })
          //   .subscribe(({ results }) => {
          //     console.log(results);
          //     if (results.length > 0) {
          //       const location: any = results[0].geometry.location;
          //       // Render map with obtained coordinates
          //       this.center = {
          //         lat: location.lat(),
          //         lng: location.lng(),
          //       };
          //     } else {
          //       console.error('No results found');
          //     }
          //   });
          this.route.data.subscribe((data) => {
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
}
