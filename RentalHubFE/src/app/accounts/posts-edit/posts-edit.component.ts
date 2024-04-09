import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, map, startWith, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { NotifierService } from 'angular-notifier';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  PublicApiServiceService,
  mockCityData,
  mockDistrictDataOfHaGiang,
  mockDistrictDataOfHanoi,
  mockWardDataOfDongVanHaGiang,
  mockWardDataOfHoanKiemHaNoi,
} from 'src/app/shared/public-api-service.service';
import { FormControl, Validators } from '@angular/forms';
import { PublicAPIData } from 'src/app/shared/resPublicAPIDataDTO';

export const _filter = (
  optionsToFilter: PublicAPIData[],
  value: string | null
): PublicAPIData[] => {
  const filterValue = value!.toLowerCase();

  return optionsToFilter.filter((option) =>
    option.full_name.toLowerCase().includes(filterValue)
  );
};

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss'],
})
export class PostsEditComponent implements OnInit, OnDestroy {
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

  cityInputControl = new FormControl('', [Validators.required]);
  cityOptions!: PublicAPIData[];
  filteredCityOptions: Observable<PublicAPIData[]> | undefined;

  districtInputControl = new FormControl('', [Validators.required]);
  districtOptions!: PublicAPIData[];
  filteredDistrictOptions: Observable<PublicAPIData[]> | undefined;

  wardInputControl = new FormControl('', [Validators.required]);
  wardOptions!: PublicAPIData[];
  filteredWardsOptions: Observable<PublicAPIData[]> | undefined;

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private publicApiService: PublicApiServiceService,
    public dialog: MatDialog
  ) {
    this.postService.getCurrentChosenTags.subscribe((tags) => {
      if (tags) {
        this.selectedTags = tags;
      }
    });
  }

  ngOnInit() {
    this.myProfileSub = this.accountService.getCurrentUser.subscribe((user) => {
      if (user) {
        this.myProfile = user;
        this.isHost = user._isHost;
      }
    });
    this.postService.setCurrentChosenTags([]);
    this.getTagSub = this.postService.getAllTags().subscribe();
    //Gọi API để lấy list thành phố
    this.publicApiService.getCity(1, 0).subscribe((res) => {
      this.cityOptions = res.data;
      this.filteredCityOptions = this.cityInputControl.valueChanges.pipe(
        startWith(''),
        map((value) => _filter(this.cityOptions, value || '')),
        tap(() => {
          if (this.cityInputControl.valid) {
            let city = this.cityOptions.find(
              (city) => city.full_name === this.cityInputControl.value
            );
            //Gọi API lấy district ứng với cityId
            if (city?.id) {
              let cityId = city!.id;
              this.publicApiService
                .getDistrictOfACity('2', cityId)
                .subscribe((res) => {
                  this.districtOptions = res.data;
                  this.filteredDistrictOptions =
                    this.districtInputControl.valueChanges.pipe(
                      startWith(''),
                      map((value) =>
                        _filter(this.districtOptions, value || '')
                      ),
                      tap(() => {
                        if (this.districtInputControl.valid) {
                          let district = this.districtOptions.find(
                            (district) =>
                              district.full_name ===
                              this.districtInputControl.value
                          );

                          if (district?.id) {
                            let districtId = district!.id;
                            this.publicApiService
                              .getWardsOfADistrict('3', districtId)
                              .subscribe((res) => {
                                this.wardOptions = res.data;
                                this.filteredWardsOptions =
                                  this.wardInputControl.valueChanges.pipe(
                                    startWith(''),
                                    map((value) =>
                                      _filter(this.wardOptions, value || '')
                                    )
                                  );
                              });
                          }
                        }
                      })
                    );
                });
            }
          }
        })
      );
    });
    // this.cityOptions = mockCityData;
  }

  ngOnDestroy(): void {
    this.myProfileSub.unsubscribe();
    this.getTagSub.unsubscribe();
  }

  getIdOfCity(): string[] {
    return [];
  }

  onVerifyAccount() {
    console.log('on verifying account ...');
    let uId = this.myProfile?._id;
    this.router.navigate(['/profile/verify-account/', uId]);
  }

  onSubmitPost(form: any) {
    this.isLoading = true;
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
