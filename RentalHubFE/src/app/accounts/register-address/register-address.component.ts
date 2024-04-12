import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, Observable, startWith, map, tap } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PublicApiServiceService } from 'src/app/shared/public-api-service.service';
import { PublicAPIData } from 'src/app/shared/resPublicAPIDataDTO';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import {
  _filter,
  _filterForStringOptions,
} from '../posts-edit/posts-edit.component';
import { AddressesService } from './addresses.service';

@Component({
  selector: 'app-register-address',
  templateUrl: './register-address.component.html',
  styleUrls: ['./register-address.component.scss'],
})
export class RegisterAddressComponent {
  title = 'Đăng ký địa chỉ';
  isLoading = false;
  isHost: boolean = false;
  myProfile!: User | null;
  myProfileSub = new Subscription();

  // previewBusinessLicene: string = '';
  // selectedBusinessLicenses?: FileList;
  // selectedBusinessLicenseFileNames?: String[];

  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];

  addressOptions!: String[];
  filteredAddressOptions!: Observable<String[]> | undefined;

  cityOptions!: PublicAPIData[];
  filteredCityOptions: Observable<PublicAPIData[]> | undefined;
  districtOptions!: PublicAPIData[];
  filteredDistrictOptions: Observable<PublicAPIData[]> | undefined;
  wardOptions!: PublicAPIData[];
  filteredWardsOptions: Observable<PublicAPIData[]> | undefined;

  registerAddress = this.formBuilder.group({
    streetInputControl: ['', Validators.required],
    cityInputControl: ['', Validators.required],
    districtInputControl: ['', Validators.required],
    wardInputControl: ['', Validators.required],
    roomTotalsInputControl: ['', Validators.required],
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
    private formBuilder: FormBuilder,
    private addressesService: AddressesService
  ) {}

  ngOnInit() {
    this.title = 'Đăng ký địa chỉ';
    this.myProfileSub = this.accountService.getCurrentUser.subscribe((user) => {
      if (user) {
        this.myProfile = user;
        this.isHost = user._isHost;
      }
    });
    this.postService.setCurrentChosenTags([]);
    //Gọi API để lấy list thành phố
    this.publicApiService.getCity(1, 0).subscribe((res) => {
      this.cityOptions = res.data;
      this.filteredCityOptions =
        this.registerAddress.controls.cityInputControl.valueChanges.pipe(
          startWith(''),
          map((value) => _filter(this.cityOptions, value || '')),
          tap(() => {
            if (this.registerAddress.controls.cityInputControl.valid) {
              let city = this.cityOptions.find(
                (city) =>
                  city.full_name ===
                  this.registerAddress.controls.cityInputControl.value
              );
              //Gọi API lấy district ứng với cityId
              if (city?.id) {
                let cityId = city!.id;
                this.publicApiService
                  .getDistrictOfACity('2', cityId)
                  .subscribe((res) => {
                    this.districtOptions = res.data;
                    this.filteredDistrictOptions =
                      this.registerAddress.controls.districtInputControl.valueChanges.pipe(
                        startWith(''),
                        map((value) =>
                          _filter(this.districtOptions, value || '')
                        ),
                        tap(() => {
                          if (
                            this.registerAddress.controls.districtInputControl
                              .valid
                          ) {
                            let district = this.districtOptions.find(
                              (district) =>
                                district.full_name ===
                                this.registerAddress.controls
                                  .districtInputControl.value
                            );

                            if (district?.id) {
                              let districtId = district!.id;
                              this.publicApiService
                                .getWardsOfADistrict('3', districtId)
                                .subscribe((res) => {
                                  this.wardOptions = res.data;
                                  this.filteredWardsOptions =
                                    this.registerAddress.controls.wardInputControl.valueChanges.pipe(
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
  }

  ngOnDestroy(): void {
    this.myProfileSub.unsubscribe();
  }

  getIdOfCity(): string[] {
    return [];
  }

  onVerifyAccount() {
    console.log('on verifying account ...');
    let uId = this.myProfile?._id;
    this.router.navigate(['/profile/verify-account/', uId]);
  }

  onSubmitAddress() {
    this.isLoading = true;
    this.notifierService.hideAll();
    console.log('on submiting post ...');
    let address = this.registerAddress.value.streetInputControl?.concat(
      ', ',
      this.registerAddress.value.wardInputControl!.toString(),
      ', ',
      this.registerAddress.value.districtInputControl!.toString(),
      ', ',
      this.registerAddress.value.cityInputControl!.toString()
    );
    let totalRoom =
      this.registerAddress.value.roomTotalsInputControl!.toString();
    if (this.selectedFiles) {
      this.addressesService
        .registerNewAddress(totalRoom, address!, this.selectedFiles)
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.notifierService.notify(
                'success',
                'Gửi yêu cầu thành công! Vui lòng chờ duyệt!'
              );
            }
          },
          (errMsg) => {
            this.notifierService.notify(
              'error',
              'Đã có lỗi xảy ra, vui lòng thử lại sau!'
            );
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

  // selectFiles(event: any, type: string): void {
  //   console.log('On selecting image...');
  //   switch (type) {
  //     case 'license':
  //       this.previewBusinessLicene = '';
  //       this.selectedBusinessLicenseFileNames = [];
  //       this.selectedBusinessLicenses = event.target.files;
  //       if (this.selectedBusinessLicenses) {
  //         const numberOfFiles = this.selectedBusinessLicenses.length;
  //         for (let i = 0; i < numberOfFiles; i++) {
  //           const reader = new FileReader();
  //           reader.onload = (e: any) => {
  //             console.log(e.target.result);
  //             this.previewBusinessLicene = e.target.result;
  //           };
  //           reader.readAsDataURL(this.selectedBusinessLicenses[i]);
  //           this.selectedBusinessLicenseFileNames.push(
  //             this.selectedBusinessLicenses[i].name
  //           );
  //         }
  //       }
  //       break;
  //     default:
  //   }
  // }
}
