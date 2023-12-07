import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { Tags } from 'src/app/shared/tags/tag.model';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss'],
})
export class PostsEditComponent implements OnInit, OnDestroy {
  isHost: boolean = false;
  myProfile!: User | null;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  previews: string[] = [];
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];
  imageInfos?: Observable<any>;

  sourceTags: Set<Tags> = new Set();
  selectedTags: Set<Tags> = new Set();

  constructor(
    private authService: AuthService,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.isHost = this.authService.isHost;
    console.log('isHost: ' + this.isHost);
    this.myProfileSub = this.authService.user.subscribe((user) => {
      this.myProfile = user;
    });
    this.getTagSub = this.postService.getAllTags().subscribe((res) => {
      if (res.data) {
        console.log('Get tags successfully...');
        res.data.forEach((tag: Tags) => {
          this.sourceTags.add(tag);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.myProfileSub.unsubscribe();
    this.getTagSub.unsubscribe();
  }
  onVerifyAccount() {
    console.log('on verifying account ...');
    let uId = this.myProfile?._id;
    this.router.navigate(['/profile/verify-account/', uId]);
  }

  onSubmitPost(form: any) {
    console.log('on submiting post ...');
    console.log('Form data: ', form);
    if (this.selectedFiles) {
      this.postService
        .createPost(form, this.selectedFiles, this.selectedTags)
        .subscribe();
    }
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);

        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  addTag(tag: any) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
  }
}
