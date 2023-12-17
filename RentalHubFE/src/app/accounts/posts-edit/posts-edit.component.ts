import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { NotifierService } from 'angular-notifier';
import { Dialog } from '@angular/cdk/dialog';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];
  selectedTags!: Tags[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {
    this.postService.getCurrentChosenTags.subscribe((tags) => {
      if (tags) {
        console.log('Get tags successfully...');
        this.selectedTags = tags;
      }
    });
  }

  ngOnInit() {
    this.isHost = this.authService.isHost;
    console.log('isHost: ' + this.isHost);
    this.myProfileSub = this.accountService.getCurrentUser.subscribe((user) => {
      this.myProfile = user;
    });

    this.postService.setCurrentChosenTags([]);
    this.getTagSub = this.postService.getAllTags().subscribe();
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
    this.notifierService.hideAll();
    if (this.selectedFiles) {
      this.postService
        .createPost(form, this.updatedFiles, this.selectedTags)
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Tạo bài viết thành công!'
              );
            }
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        );
    } else {
      this.notifierService.notify('warning', 'Vui lòng điền đủ các trường!');
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
      this.postService.setCurrentChosenTags(
        this.selectedTags.filter((currentTag) => currentTag !== tag)
      );
    } else {
      this.selectedTags.push(tag);
    }
  }

  createTag() {
    const dialogRef = this.dialog.open(AddTagDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
