import { Component, Inject, OnInit } from '@angular/core';
import { PostService } from 'src/app/posts/post.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { Tags } from 'src/app/shared/tags/tag.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['./post-edit-dialog.component.scss'],
})
export class PostEditDialogComponent implements OnInit {
  private getProfileSub!: Subscription;
  private getPostHistorySub!: Subscription;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  isHost: boolean = false;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();

  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];

  selectedTags!: Tags[];

  currentActiveStatus = {
    status: 4, //All posts
    data: this.historyPosts,
  };

  currentPost!: PostItem;
  authService: any;
  constructor(
    private postService: PostService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentPost = this.data;
    console.log(
      '🚀 ~ file: post-edit-dialog.component.ts:54 ~ PostEditDialogComponent ~ this.currentPost:',
      this.currentPost
    );
  }

  ngOnInit(): void {
    this.previews = this.data._images;
    this.postService.getCurrentChosenTags.subscribe((tags) => {
      this.selectedTags = tags;
    });
  }

  onSubmitPost(form: any) {
    console.log('on submiting post ...');
    console.log('Form data: ', form);
    if (this.previews) {
      console.log(
        '🚀 ~ file: post-edit-dialog.component.ts:59 ~ PostEditDialogComponent ~ onSubmitPost ~ this.selectedFiles:',
        this.selectedFiles
      );
      this.postService
        .updatePost(
          form,
          this.updatedFiles,
          this.deletedImageIndexes,
          this.selectedTags,
          this.data._id
        )
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Cập nhật bài viết thành công!'
              );
            }
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        );
    } else {
      if (this.selectedFiles) {
        this.notifierService.notify(
          'warning',
          'Vui lòng không để trống ảnh của bài viết!'
        );
      }
    }
  }

  updateFile(event: any, index: number): void {
    console.log('On updating file...');
    this.selectedFiles = event.target.files;
    const updatedFileList = new DataTransfer();
    if (this.updatedFiles) {
      for (let i = 0; i < this.updatedFiles.length; i++) {
        updatedFileList.items.add(this.updatedFiles[i]);
      }
    }
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        updatedFileList.items.add(this.selectedFiles[i]);
      }
    }
    this.updatedFiles = updatedFileList.files;

    //Render
    if (this.selectedFiles) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews[index] = e.target.result;
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  addNewImage(event: any) {
    this.selectedFiles = event.target.files;
    const updatedFileList = new DataTransfer();
    if (this.updatedFiles) {
      for (let i = 0; i < this.updatedFiles.length; i++) {
        updatedFileList.items.add(this.updatedFiles[i]);
      }
    }
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        updatedFileList.items.add(this.selectedFiles[i]);
      }
    }
    this.updatedFiles = updatedFileList.files;

    //Render
    if (this.selectedFiles) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  deleteImage(preview: any, index: number) {
    this.previews.splice(index, 1, '');
    if (!this.deletedImageIndexes.includes(index)) {
      this.deletedImageIndexes.push(index);
      console.log(
        '🚀 ~ file: post-edit-dialog.component.ts:101 ~ PostEditDialogComponent ~ updateFile ~ this.deletedImageIndexes:',
        this.deletedImageIndexes
      );
    }
    // if(this.selectedFileNames.includes(preview)){
    //   this.selectedFiles.
    // }
  }

  updateChosentags(tag: any) {
    if (this.selectedTags.includes(tag)) {
      const updatedTags = this.selectedTags.filter(
        (currentTag) => currentTag !== tag
      );
      this.selectedTags = updatedTags;
    } else {
      this.selectedTags.push(tag);
    }
    this.postService.getCurrentPostingHistory.subscribe((historyPosts) => {
      historyPosts!.forEach((post) => {
        if (post._id === this.currentPost._id) {
          post._tags = this.selectedTags;
          console.log(
            '🚀 ~ file: post-edit-dialog.component.ts:191 ~ PostEditDialogComponent ~ this.historyPosts.forEach ~  post._tags:',
            post._tags
          );
        }
      });
      this.postService.setCurrentChosenTags(this.selectedTags);
    });
  }

  createTag() {
    const dialogRef = this.dialog.open(AddTagDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  toHidePostDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn gỡ bài viết này không?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.postService
        .updatePostStatus(this.data._id, false)
        .subscribe((res) => {
          if (res.data) {
            this.notifierService.hideAll();
            this.notifierService.notify('success', 'Gỡ bài viết thành công!');
          }
        });
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  toOpenPostDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn mở lại bài viết? Bài viết sẽ nằm trong mục Chờ duyệt!',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.postService
        .updatePostStatus(this.data._id, true)
        .subscribe((res) => {
          if (res.data) {
            this.notifierService.hideAll();
            this.notifierService.notify(
              'success',
              'Mở lại bài viết thành công!'
            );
          }
        });
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
