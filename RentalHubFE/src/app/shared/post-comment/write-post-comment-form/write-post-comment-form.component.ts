import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { ForumService } from 'src/app/forum/forum.service';
import { PostCommentModel } from './post-comment.model';

@Component({
  selector: 'app-write-post-comment-form',
  templateUrl: './write-post-comment-form.component.html',
  styleUrls: ['./write-post-comment-form.component.scss'],
})
export class WritePostCommentFormComponent implements OnInit, OnDestroy {
  @Input() commentForParent: {
    creatorName: string | null;
    creatorId: string | null;
  } = { creatorId: null, creatorName: null };
  @Input() commentForPostId!: string;
  @Output() createCommentSuccess = new EventEmitter<PostCommentModel[]>();
  $destroy: Subject<boolean> = new Subject();
  currentUser: User | null = null;
  isNotSubmitted: boolean = true;
  showEmojiPicker: boolean = false;
  showUploadFileArea: boolean = false;
  commentEditForm = this.formBuilder.group({
    commentInputControl: [{ value: '', disabled: false }, Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });

  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private forumService: ForumService,
    private notifierService: NotifierService
  ) {}
  ngOnInit(): void {
    this.isNotSubmitted = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  submitComment() {
    this.isNotSubmitted = false;
    console.log(this.commentEditForm.value.commentInputControl);
    //Call API to submit comment
    if (this.commentEditForm.value.commentInputControl || this.updatedFiles) {
      this.forumService
        .createComment(
          this.commentForPostId,
          this.commentForParent.creatorId,
          this.commentEditForm.value.commentInputControl!,
          this.updatedFiles
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.notifierService.notify('success', 'Gửi bình luận thành công!');
            this.commentEditForm.patchValue({
              commentInputControl: '',
            });
            this.showEmojiPicker = false;
            this.showUploadFileArea = false;
            this.createCommentSuccess.emit(res.data);
          }
        });
    } else {
      this.notifierService.notify(
        'error',
        'Nội dung bình luận phải chứa ký tự hoặc ảnh!'
      );
    }
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    let comment = this.commentEditForm.value.commentInputControl;
    const text = `${comment}${event.emoji.native}`;
    this.commentEditForm.patchValue({
      commentInputControl: text,
    });
  }

  commentInputOnFocus() {
    this.showEmojiPicker = false;
  }

  uploadFileIconClicked() {
    this.showUploadFileArea = !this.showUploadFileArea;
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
    console.log('On adding new image...');
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
    this.previews.splice(index, 1);
    console.log(
      '🚀 ~ PostsEditComponent ~ deleteImage ~ this.previews:',
      this.previews.length
    );
    if (!this.deletedImageIndexes.includes(index)) {
      this.deletedImageIndexes.push(index);
      console.log(
        '🚀 ~ file: post-edit-dialog.component.ts:101 ~ PostEditDialogComponent ~ updateFile ~ this.deletedImageIndexes:',
        this.deletedImageIndexes
      );
    }

    this.removeFileFromFileList(index);
  }

  removeFileFromFileList(index: number) {
    const updatedFileList = new DataTransfer();
    if (this.updatedFiles) {
      for (let i = 0; i < this.updatedFiles.length; i++) {
        updatedFileList.items.add(this.updatedFiles[i]);
        if (index === i) {
          updatedFileList.items.remove(index);
        }
      }
    }
    this.updatedFiles = updatedFileList.files;
    console.log(
      '🚀 ~ WritePostCommentFormComponent ~ removeFileFromFileList ~ this.updatedFiles:',
      this.updatedFiles
    );
  }
}
