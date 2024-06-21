import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';
import { FileUploadService } from 'src/app/shared/file-upload.services';
import { ForumService } from '../forum.service';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-social-post-edit-dialog',
  templateUrl: './social-post-edit-dialog.component.html',
  styleUrls: ['./social-post-edit-dialog.component.scss'],
})
export class SocialPostEditDialogComponent implements OnDestroy, OnInit {
  @ViewChild('postContent')
  textEditorForPostContent!: RichTextEditorComponent;
  @Output() updateSucess: EventEmitter<any> = new EventEmitter();
  postHtmlContent!: string;
  btnElement!: HTMLElement | null;

  title: string = '';
  isLoading: boolean = false;
  $destroy: Subject<boolean> = new Subject();
  error: string = '';
  currentPost: any | null = null;

  selectedFiles?: FileList | null = null;
  selectedFileNames: string[] = [];
  message: string[] = [];
  previews: string[] = [];

  public customToolbar: Object = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      'FontColor',
      'BackgroundColor',
      'LowerCase',
      'UpperCase',
      'Alignments',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      'Undo',
      'Redo',
    ],
  };

  postEditForm = this.formBuilder.group({
    idInputControl: [{ value: '', disabled: true }],
    titleInputControl: [{ value: '', disabled: false }, Validators.required],
    contentInputControl: [{ value: '', disabled: false }, Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });

  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private forumService: ForumService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentPost = data;
  }
  ngOnInit(): void {
    //Initite postEdit form value
    if (this.currentPost) {
      this.title = 'Nội dung bài viết';
      this.postEditForm.patchValue({
        idInputControl: this.currentPost._id,
        titleInputControl: this.currentPost._title,
        contentInputControl: this.currentPost._content,
      });
      this.previews.push(this.currentPost._images);
    } else {
      this.title = 'Tạo bài viết';
    }
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  saveSocialPost() {
    console.log(this.postEditForm, this.currentPost);
    console.log('On saving social post...', this.postEditForm.value);
    this.isLoading = true;
    if (this.selectedFiles) {
      this.savePostWithImageFile(this.selectedFiles[0]);
    } else {
      this.savePostWithImageFile(null);
    }
  }

  savePostWithImageFile(image: File | null) {
    //Create
    if (!this.currentPost) {
      this.forumService
        .createSocialPost(this.postEditForm.value, image!)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify('success', 'Tạo bài viết thành công');
              this.isLoading = false;
            }
          },
          (err) => {
            this.notifierService.notify(
              'error',
              'Đã có lỗi xảy ra, vui lòng thử lại sau!'
            );
          }
        );
    }
    //Update
    else {
      console.log('Update post...', this.postEditForm.value.idInputControl);
      this.forumService
        .updateSocialPost(this.currentPost._id, this.postEditForm.value, image)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Cập nhật bài viết thành công'
              );

              let updatedPost: any = {
                _title: this.postEditForm.value.titleInputControl,
                _content: this.postEditForm.value.contentInputControl,
                _images: null,
              };
              if (this.previews) {
                updatedPost._images = this.previews[0];
              }
              this.updateSucess.emit(updatedPost);
              this.isLoading = false;
            }
          },
          (err) => {
            this.notifierService.notify(
              'error',
              'Đã có lỗi xảy ra, vui lòng thử lại sau!'
            );
          }
        );
    }
  }

  selectFiles(event: any): void {
    this.message = [];
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

  uploadFiles(): void {
    console.log('Uploading files...');
    this.message = [];
    this.isLoading = true;
  }
}
