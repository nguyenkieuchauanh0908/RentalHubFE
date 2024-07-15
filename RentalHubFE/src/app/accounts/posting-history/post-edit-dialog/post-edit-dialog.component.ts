import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PostService } from 'src/app/posts/post.service';
import {
  Subscription,
  Observable,
  interval,
  map,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { Tags } from 'src/app/shared/tags/tag.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PublicAPIData } from 'src/app/shared/resPublicAPIDataDTO';
import { AddressesService } from '../../register-address/addresses.service';
import { _filterForStringOptions } from '../../posts-edit/posts-edit.component';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['./post-edit-dialog.component.scss'],
})
export class PostEditDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('contentToDisplay') contentToDisplay: ElementRef | undefined;
  @ViewChild('postContent')
  textEditorForPostContent!: RichTextEditorComponent;
  @ViewChild('contentValue') contentValue!: ElementRef | undefined;
  postHtmlContent!: string;
  btnElement!: HTMLElement | null;
  seeMore: boolean = false;
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

  title = 'Chi tiết bài viết';
  $destroy: Subject<Boolean> = new Subject();
  isLoading: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 100;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  isHost: boolean = true;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();

  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];

  selectedTags!: Tags[];

  addressOptions: String[] = new Array<string>();
  filteredAddressOptions!: Observable<String[]> | undefined;

  currentPost!: PostItem;

  postEditForm = this.formBuilder.group({
    idInputControl: [{ value: '', disabled: true }],
    titleInputControl: [{ value: '', disabled: false }, Validators.required],
    descInputControl: [{ value: '', disabled: false }, Validators.required],
    contentInputControl: [{ value: '', disabled: false }, Validators.required],
    addressInputControl: [{ value: '', disabled: true }, Validators.required],
    areaInputControl: [{ value: 0, disabled: false }, Validators.required],
    renting_priceInputControl: [
      { value: 0, disabled: false },
      Validators.required,
    ],
    electricInputControl: [{ value: 0, disabled: false }, Validators.required],
    water_priceInputControl: [
      { value: 0, disabled: false },
      Validators.required,
    ],
    servicesInputControl: [
      { value: [''], disabled: false },
      Validators.required,
    ],
    utilitiesInputControl: [
      { value: [''], disabled: false },
      Validators.required,
    ],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });
  constructor(
    private postService: PostService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private addressesService: AddressesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }
  ngAfterViewInit(): void {
    window.scrollTo(0, 0); // Scrolls the page to the top
    setTimeout(() => this.attachingInnerHtmlContent(), 100);
  }

  ngOnInit(): void {
    this.currentPost = this.data;
    if (this.data._status === 4) {
      this.title = 'Chi tiết thông báo';
    } else {
      this.title = 'Chi tiết bài viết';
    }

    //Initite postEdit form value
    if (this.currentPost) {
      this.postEditForm.patchValue({
        idInputControl: this.currentPost._id,
        titleInputControl: this.currentPost._title,
        descInputControl: this.currentPost._desc,
        contentInputControl: this.currentPost._content,
        addressInputControl: this.currentPost.roomAddress,
        areaInputControl: this.currentPost.roomArea,
        renting_priceInputControl: this.currentPost.roomPrice,
        electricInputControl: this.currentPost.roomElectricPrice,
        water_priceInputControl: this.currentPost.roomWaterPrice,
        servicesInputControl: this.currentPost.roomServices,
        utilitiesInputControl: this.currentPost.roomUtilities,
      });
      if (this.currentPost._status === 4) {
        this.postEditForm.controls['titleInputControl'].disable();
        this.postEditForm.controls['descInputControl'].disable();
        this.postEditForm.controls['contentInputControl'].disable();
        this.postEditForm.controls['addressInputControl'].disable();
        this.postEditForm.controls['areaInputControl'].disable();
        this.postEditForm.controls['renting_priceInputControl'].disable();
        this.postEditForm.controls['electricInputControl'].disable();
        this.postEditForm.controls['water_priceInputControl'].disable();
        this.postEditForm.controls['servicesInputControl'].disable();
        this.postEditForm.controls['utilitiesInputControl'].disable();
      }
    }

    //List địa chỉ của user
    this.addressOptions = [];
    this.addressesService.getCurrentRegisteredAddress.subscribe((addresses) => {
      if (addresses) this.addressOptions = addresses;
    });
    this.filteredAddressOptions =
      this.postEditForm.controls.addressInputControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          _filterForStringOptions(this.addressOptions, value || '')
        )
      );
    this.previews = this.data._images;
    this.postService.getCurrentChosenTags.subscribe((tags) => {
      this.selectedTags = tags;
    });
  }

  attachingInnerHtmlContent() {
    if (this.contentToDisplay) {
      this.contentToDisplay.nativeElement.innerHTML = this.data._content;
    } else {
      setTimeout(() => this.attachingInnerHtmlContent(), 100);
    }
  }

  reopenPost() {}

  onSubmitPost() {
    this.isLoading = true;
    console.log('on submiting post ...');
    console.log('Form data: ', this.postEditForm.value);
    this.notifierService.hideAll();
    if (
      this.selectedTags.length > 0 &&
      (this.updatedFiles || this.deletedImageIndexes || this.data._images)
    ) {
      console.log('🚀 ~ onSubmitPost ~ this.selectedTags:', this.selectedTags);
      this.postService
        .updatePost(
          this.postEditForm.value,
          this.updatedFiles,
          this.deletedImageIndexes,
          this.selectedTags,
          this.data._id
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Cập nhật bài viết thành công!'
              );
              this.isLoading = false;
            }
          },
          (errMsg) => {
            this.isLoading = false;
            this.notifierService.notify('error', errMsg);
          }
        );
    } else {
      this.isLoading = false;
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
    }
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
        }
      });
      this.postService.setCurrentChosenTags(this.selectedTags);
    });
  }

  createTag() {
    const dialogRef = this.dialog.open(AddTagDialogComponent, {
      width: '400px',
    });
  }

  toHidePostDialog() {
    window.scrollTo(0, 0); // Scrolls the page to the top
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
    window.scrollTo(0, 0); // Scrolls the page to the top

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

  seeMoreContentClick() {
    this.seeMore = !this.seeMore;
  }
}
