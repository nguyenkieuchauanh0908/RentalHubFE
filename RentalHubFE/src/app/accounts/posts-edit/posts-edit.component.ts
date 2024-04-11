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
import { PublicApiServiceService } from 'src/app/shared/public-api-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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

  addressOptions!: String[];
  filteredAddressOptions!: Observable<String[]> | undefined;

  cityOptions!: PublicAPIData[];
  filteredCityOptions: Observable<PublicAPIData[]> | undefined;
  districtOptions!: PublicAPIData[];
  filteredDistrictOptions: Observable<PublicAPIData[]> | undefined;
  wardOptions!: PublicAPIData[];
  filteredWardsOptions: Observable<PublicAPIData[]> | undefined;

  postEditForm = this.formBuilder.group({
    titleInputControl: ['', Validators.required],
    descInputControl: ['', Validators.required],
    contentInputControl: ['', Validators.required],
    addressInputControl: ['', Validators.required],
    streetInputControl: ['', Validators.required],
    cityInputControl: ['', Validators.required],
    districtInputControl: ['', Validators.required],
    wardInputControl: ['', Validators.required],
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
    private publicApiService: PublicApiServiceService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
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
      this.filteredCityOptions =
        this.postEditForm.controls.cityInputControl.valueChanges.pipe(
          startWith(''),
          map((value) => _filter(this.cityOptions, value || '')),
          tap(() => {
            if (this.postEditForm.controls.cityInputControl.valid) {
              let city = this.cityOptions.find(
                (city) =>
                  city.full_name ===
                  this.postEditForm.controls.cityInputControl.value
              );
              //Gọi API lấy district ứng với cityId
              if (city?.id) {
                let cityId = city!.id;
                this.publicApiService
                  .getDistrictOfACity('2', cityId)
                  .subscribe((res) => {
                    this.districtOptions = res.data;
                    this.filteredDistrictOptions =
                      this.postEditForm.controls.districtInputControl.valueChanges.pipe(
                        startWith(''),
                        map((value) =>
                          _filter(this.districtOptions, value || '')
                        ),
                        tap(() => {
                          if (
                            this.postEditForm.controls.districtInputControl
                              .valid
                          ) {
                            let district = this.districtOptions.find(
                              (district) =>
                                district.full_name ===
                                this.postEditForm.controls.districtInputControl
                                  .value
                            );

                            if (district?.id) {
                              let districtId = district!.id;
                              this.publicApiService
                                .getWardsOfADistrict('3', districtId)
                                .subscribe((res) => {
                                  this.wardOptions = res.data;
                                  this.filteredWardsOptions =
                                    this.postEditForm.controls.wardInputControl.valueChanges.pipe(
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

    //List địa chỉ của user
    this.addressOptions = [
      '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức',
      '26/17 Lê Đức Thọ, Gò Vấp, Hồ Chí Minh',
      '123/4/5 Lê Văn Thọ, Làng Hoa, Gò Vấp',
    ];
    this.filteredAddressOptions =
      this.postEditForm.controls.addressInputControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          _filterForStringOptions(this.addressOptions, value || '')
        )
        // tap(() => {
        //   if (this.postEditForm.controls.cityInputControl.valid) {
        //     let city = this.cityOptions.find(
        //       (city) =>
        //         city.full_name ===
        //         this.postEditForm.controls.cityInputControl.value
        //     );
        //     //Gọi API lấy district ứng với cityId
        //     if (city?.id) {
        //       let cityId = city!.id;
        //       this.publicApiService
        //         .getDistrictOfACity('2', cityId)
        //         .subscribe((res) => {
        //           this.districtOptions = res.data;
        //           this.filteredDistrictOptions =
        //             this.postEditForm.controls.districtInputControl.valueChanges.pipe(
        //               startWith(''),
        //               map((value) =>
        //                 _filter(this.districtOptions, value || '')
        //               ),
        //               tap(() => {
        //                 if (
        //                   this.postEditForm.controls.districtInputControl
        //                     .valid
        //                 ) {
        //                   let district = this.districtOptions.find(
        //                     (district) =>
        //                       district.full_name ===
        //                       this.postEditForm.controls.districtInputControl
        //                         .value
        //                   );

        //                   if (district?.id) {
        //                     let districtId = district!.id;
        //                     this.publicApiService
        //                       .getWardsOfADistrict('3', districtId)
        //                       .subscribe((res) => {
        //                         this.wardOptions = res.data;
        //                         this.filteredWardsOptions =
        //                           this.postEditForm.controls.wardInputControl.valueChanges.pipe(
        //                             startWith(''),
        //                             map((value) =>
        //                               _filter(this.wardOptions, value || '')
        //                             )
        //                           );
        //                       });
        //                   }
        //                 }
        //               })
        //             );
        //         });
        //     }
        //   }
        // })
      );
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

  onSubmitPost() {
    this.isLoading = true;
    console.log('on submiting post ...');
    console.log('Form data: ', this.postEditForm.value);
    console.log(
      '🚀 ~ PostsEditComponent ~ onSubmitPost ~ this.selectedTags:',
      this.selectedTags
    );
    console.log(
      '🚀 ~ PostsEditComponent ~ onSubmitPost ~ this.selectedFiles:',
      this.selectedFiles
    );
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
