import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, map, startWith, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { NotifierService } from 'angular-notifier';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PublicApiServiceService } from 'src/app/shared/public-api-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PublicAPIData } from 'src/app/shared/resPublicAPIDataDTO';
import { AddressesService } from '../register-address/addresses.service';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

export const _filter = (
  optionsToFilter: PublicAPIData[],
  value: string | null
): PublicAPIData[] => {
  const filterValue = value!.toLowerCase();
  return optionsToFilter.filter((option) =>
    option.full_name.toLowerCase().includes(filterValue)
  );
};

export const _filterForStringOptions = (
  optionsToFilter: String[],
  value: string | null
): String[] => {
  const filterValue = value!.toLowerCase();
  return optionsToFilter.filter((option) =>
    option.toLowerCase().includes(filterValue)
  );
};

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss'],
})
export class PostsEditComponent implements OnInit, OnDestroy {
  @ViewChild('postContent')
  textEditorForPostContent!: RichTextEditorComponent;
  postHtmlContent!: string;
  btnElement!: HTMLElement | null;

  isLoading = false;
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

  addressOptions: String[] = new Array<string>();
  filteredAddressOptions!: Observable<String[]> | undefined;
  $destroy: Subject<boolean> = new Subject<boolean>();

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
    titleInputControl: ['', Validators.required],
    descInputControl: ['', Validators.required],
    contentInputControl: ['', Validators.required],
    addressInputControl: ['', Validators.required],
    areaInputControl: ['', Validators.required],
    renting_priceInputControl: ['', Validators.required],
    electricInputControl: ['', Validators.required],
    water_priceInputControl: ['', Validators.required],
    servicesInputControl: ['', Validators.required],
    utilitiesInputControl: ['', Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private addressesService: AddressesService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.myProfileSub = this.accountService.getCurrentUser.subscribe((user) => {
      if (user) {
        this.myProfile = user;
        this.isHost = user._isHost;
        if (this.myProfile) {
          console.log(
            '🚀 ~ PostsEditComponent ~ this.myProfileSub=this.accountService.getCurrentUser.subscribe ~ this.myProfile:',
            this.myProfile
          );
          if (this.myProfile._totalPosts === this.myProfile._usePosts) {
            this.notifierService.notify(
              'warning',
              'Đã dùng hết lượt đăng bài! Vui lòng mua thêm!'
            );
          }
          //Sucribe Gọi API lấy thông tin về gói đăng bài
          //Get tags
          this.postService.getCurrentChosenTags.subscribe((tags) => {
            if (tags) {
              this.selectedTags = tags;
            }
          });
          this.postService.setCurrentChosenTags([]);
          this.getTagSub = this.postService.getAllTags().subscribe();

          //List địa chỉ của user
          this.addressOptions = [];
          this.addressesService.getCurrentRegisteredAddress.subscribe(
            (addresses) => {
              if (addresses) this.addressOptions = addresses;
            }
          );
          this.filteredAddressOptions =
            this.postEditForm.controls.addressInputControl.valueChanges.pipe(
              startWith(''),
              map((value) =>
                _filterForStringOptions(this.addressOptions, value || '')
              )
            );
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.myProfileSub.unsubscribe();
    this.getTagSub.unsubscribe();
  }

  goToPaymentPackacges() {
    this.router.navigate(['/payment/packages']);
  }

  getIdOfCity(): string[] {
    return [];
  }

  onVerifyAccount() {
    console.log('on verifying account ...');
    let uId = this.myProfile?._id;
    this.router.navigate(['/profile/verify-account/', uId]);
  }

  goToRegisterNewAddress() {
    console.log('go to register new address ...');
    let uId = this.myProfile?._id;
    this.router.navigate(['/profile/register-address/', uId]);
  }

  onSubmitPost() {
    this.isLoading = true;
    // console.log('on submiting post ...Form data: ', this.postEditForm.value);
    // console.log(
    //   '🚀 ~ PostsEditComponent ~ onSubmitPost ~ this.selectedTags:',
    //   this.selectedTags
    // );
    // console.log(
    //   '🚀 ~ PostsEditComponent ~ onSubmitPost ~ this.selectedFiles:',
    //   this.selectedFiles
    // );
    this.notifierService.hideAll();
    if (this.selectedFiles && this.selectedTags) {
      this.postService
        .createPost(
          this.postEditForm.value,
          this.updatedFiles,
          this.selectedTags
        )
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Tạo bài viết thành công!'
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
    this.postService.setCurrentChosenTags(this.selectedTags);
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
