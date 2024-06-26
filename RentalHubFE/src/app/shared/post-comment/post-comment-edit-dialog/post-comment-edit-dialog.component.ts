import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PostCommentModel } from '../write-post-comment-form/post-comment.model';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ForumService } from 'src/app/forum/forum.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Utils } from '../../utils';

@Component({
  selector: 'app-post-comment-edit-dialog',
  templateUrl: './post-comment-edit-dialog.component.html',
  styleUrls: ['./post-comment-edit-dialog.component.scss'],
})
export class PostCommentEditDialogComponent implements OnInit, OnDestroy {
  @Input() commentForParent: {
    creatorName: string | null;
    creatorId: string | null;
  } = { creatorId: null, creatorName: null };
  @Input() commentForPostId!: string;
  @Output() updateCommentSuccess = new EventEmitter<PostCommentModel>();
  $destroy: Subject<boolean> = new Subject();
  isLoading: boolean = false;
  currentUser: User | null = null;
  isNotSubmitted: boolean = true;
  showEmojiPicker: boolean = false;
  showUploadFileArea: boolean = false;
  initialImagesLength: number = 0;
  commentEditForm = this.formBuilder.group({
    commentInputControl: [{ value: '', disabled: false }, Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });

  preDeletedIndex: number = 0;
  totalDeletedImagesUntilCleared = 0;
  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];
  title: string = 'Chi tiết bình luận';
  currentComment: PostCommentModel | null = null;
  utils = new Utils();

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private forumService: ForumService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: PostCommentModel
  ) {}
  ngOnInit(): void {
    this.showUploadFileArea = false;
    this.showEmojiPicker = false;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.currentUser = user;
        this.currentComment = this.data;
        console.log(
          '🚀 ~ PostCommentEditDialogComponent ~ this.currentComment:',
          this.currentComment
        );
        this.initialImagesLength = this.currentComment._images.length;
        if (this.currentUser && this.currentComment) {
          this.commentEditForm.patchValue({
            commentInputControl: this.currentComment._content,
          });
          if (this.currentComment._images.length > 0) {
            this.previews = this.currentComment._images;
            this.showUploadFileArea = true;
          }
        }
        this.isLoading = false;
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  submitComment() {
    this.isNotSubmitted = false;
    console.log(
      'Param values',
      this.commentEditForm.value.commentInputControl,
      this.updatedFiles,
      this.deletedImageIndexes
    );

    //Call API to submit comment
    if (this.commentEditForm.value.commentInputControl || this.updatedFiles) {
      this.forumService
        .updateComment(
          this.currentComment!._id,
          this.commentEditForm.value.commentInputControl!,
          this.updatedFiles,
          this.deletedImageIndexes
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.commentEditForm.patchValue({
              commentInputControl: '',
            });
            this.showEmojiPicker = false;
            this.showUploadFileArea = false;
            this.updateCommentSuccess.emit(res.data);
            this.dialog.closeAll();
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
    this.preDeletedIndex = this.previews.length - 1;
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
    this.preDeletedIndex = this.previews.length - 1;
  }

  deleteImage(preview: any, index: number) {
    this.previews.splice(index, 1, '');
    console.log(
      "🚀 ~ PostCommentEditDialogComponent ~ deleteImage ~ this.utils.countTimesAppearedOfAnItemInAnArray('', this.previews):",
      this.utils.countTimesAppearedOfAnItemInAnArray('', this.previews)
    );
    console.log(
      '🚀 ~ PostCommentEditDialogComponent ~ deleteImage ~ this.currentComment!._images.length:',
      this.initialImagesLength
    );
    console.log(
      '🚀 ~ PostCommentEditDialogComponent ~ deleteImage ~ this.totalDeletedImagesUntilCleared:',
      this.totalDeletedImagesUntilCleared
    );
    if (
      !this.deletedImageIndexes.includes(index) &&
      this.utils.countTimesAppearedOfAnItemInAnArray('', this.previews) <=
        this.initialImagesLength
    ) {
      this.deletedImageIndexes.push(index);
    }
    if (
      this.utils.countTimesAppearedOfAnItemInAnArray('', this.previews) >
      this.initialImagesLength
    ) {
      console.log(
        'Deleted at index ',
        index - this.initialImagesLength - this.totalDeletedImagesUntilCleared,
        'of updatedFiles'
      );
      this.removeFileFromFileList(
        index - this.initialImagesLength - this.totalDeletedImagesUntilCleared
      );
      this.totalDeletedImagesUntilCleared += 1;
      if (this.updatedFiles.length == 0) {
        console.log('AAAAAAAAAAAAAAA');
        this.totalDeletedImagesUntilCleared = 0;
      }
    }
  }

  removeFileFromFileList(index: number) {
    const updatedFileList = new DataTransfer();
    // let updatedIndiex = index;
    // if (this.preDeletedIndex < index) {
    //   updatedIndiex -= 1;
    // }
    // console.log(updatedIndiex);
    if (this.updatedFiles) {
      for (let i = 0; i < this.updatedFiles.length; i++) {
        updatedFileList.items.add(this.updatedFiles[i]);
        if (i === index) {
          updatedFileList.items.remove(index);
        }
      }
    }
    this.updatedFiles = updatedFileList.files;
    // this.preDeletedIndex = index;

    console.log(
      '🚀 ~ WritePostCommentFormComponent ~ removeFileFromFileList ~ this.updatedFiles:',
      this.updatedFiles.length
    );
  }

  cancelDialog() {
    this.dialog.closeAll();
  }
}
