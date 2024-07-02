import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { AddressesService } from '../register-address/addresses.service';
import { Address } from '../register-address/address.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AddressDetailComponent } from './address-detail/address-detail.component';

@Component({
  selector: 'app-manage-addresses',
  templateUrl: './manage-addresses.component.html',
  styleUrls: ['./manage-addresses.component.scss'],
})
export class ManageAddressesComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject();
  title!: string;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  addresses: Address[] = new Array<Address>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  isHost: boolean = false;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  previews: string[] = [];
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];
  imageInfos?: Observable<any>;

  sourceTags: Set<Tags> = new Set();
  selectedTags: Set<Tags> = new Set();

  isLoading: boolean = false;
  currentActiveStatus = {
    status: 0, //All posts
    data: this.addresses,
  };

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private postService: PostService,
    private paginationService: PaginationService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private addressesService: AddressesService
  ) {}
  ngOnInit(): void {
    this.title = 'Quản lý địa chỉ';
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.addresses = [];
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.currentUid = user._id;
          // this.currentUid = this.accountService.getCurrentUserId();
          this.currentActiveStatus.status = 0;
          if (this.currentUid) {
            this.myProfile = this.accountService.getProfile(this.currentUid);
          }
          this.addressesService
            .getAddresses(this.currentActiveStatus.status, 1, 5)
            .subscribe(
              (res) => {
                if (res.data) {
                  this.addresses = res.data;
                  this.paginationService.pagination = res.pagination;
                  this.totalPages = res.pagination.total;
                } else {
                  this.addresses = [];
                }
                this.isLoading = false;
              },
              (errorMsg) => {
                this.isLoading = false;
              }
            );
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  seeDetail(addressId: String) {
    this.isLoading = true;
    this.addressesService
      .getAddressById(addressId)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        this.isLoading = false;
        if (res.data) {
          let dialogRef = this.dialog.open(AddressDetailComponent, {
            width: '1000px',
            data: res.data,
          });
          let sub = dialogRef.componentInstance.closeAddress.subscribe(() => {
            this.toSensoredAddresses();
          });
          sub = dialogRef.componentInstance.reopenAddress.subscribe(() => {
            this.toUnsuedAddresses();
          });
          dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
          });
        }
      });
  }

  updateAddressStatus(addressId: String, status: number) {
    this.isLoading = true;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn gỡ/mở lại địa chỉ này?',
    });
    let sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.addressesService.updataAddressStatus(addressId, status).subscribe(
        (res) => {
          this.isLoading = false;
          if (res.data) {
            this.notifierService.notify('success', 'Gỡ/mở địa chỉ thành công!');
            if (status === 1) {
              this.toUnsuedAddresses();
            }
            if (status === 3) {
              this.toSensoredAddresses();
            }
          }
        },
        (errMsg) => {
          this.notifierService.notify('error', errMsg);
        }
      );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  //Status = 0
  toWaitingAddresses() {
    this.currentActiveStatus.status = 0;
    this.addresses = [];
    this.isLoading = true;
    this.addressesService
      .getAddresses(this.currentActiveStatus.status, 1, 5)
      .subscribe(
        (res) => {
          if (res.data) {
            console.log(
              '🚀 ~ ManageAddressesComponent ~ toWaitingAddresses ~ res.data:',
              res.data
            );

            this.addresses = res.data;
            this.paginationService.pagination = res.pagination;
            this.totalPages = res.pagination.total;
          } else {
            this.addresses = [];
          }
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  //Status = 2
  toUnsensoredAddresses() {
    this.addresses = [];
    this.isLoading = true;
    this.currentActiveStatus.status = 2;
    this.addressesService
      .getAddresses(this.currentActiveStatus.status, 1, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            console.log(
              '🚀 ~ ManageAddressesComponent ~ toUnsensoredAddresses ~ res.data:',
              res.data
            );

            this.addresses = res.data;
            this.paginationService.pagination = res.pagination;
            this.totalPages = res.pagination.total;
          } else {
            this.addresses = [];
          }
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  //Status = 1
  toSensoredAddresses() {
    this.currentActiveStatus.status = 1;
    this.addresses = [];
    this.isLoading = true;
    this.addressesService
      .getAddresses(this.currentActiveStatus.status, 1, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            console.log(
              '🚀 ~ ManageAddressesComponent ~ toSensoredAddresses ~ res.data:',
              res.data
            );

            this.addresses = res.data;
            this.paginationService.pagination = res.pagination;
            this.totalPages = res.pagination.total;
          } else {
            this.addresses = [];
          }
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  //Status = 3
  toUnsuedAddresses() {
    this.currentActiveStatus.status = 3;
    this.isLoading = true;
    this.addresses = [];
    this.addressesService
      .getAddresses(this.currentActiveStatus.status, 1, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            console.log(
              '🚀 ~ ManageAddressesComponent ~ toUnsuedAddresses ~ res.data:',
              res.data
            );

            this.addresses = res.data;
            this.paginationService.pagination = res.pagination;
            this.totalPages = res.pagination.total;
          } else {
            this.addresses = [];
          }
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
    this.isLoading = true;
    this.addresses = [];
    if (position === 1 || position === -1) {
      this.currentPage = this.paginationService.navigatePage(
        position,
        this.currentPage
      );
    }
    if (toFirstPage) {
      this.currentPage = 1;
    } else if (toLastPage) {
      this.currentPage = this.totalPages;
    }
    this.addressesService
      .getAddresses(0, 1, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            console.log('🚀 ~ ManageAddressesComponent ~ res.data:', res.data);
            window.scrollTo(0, 0); // Scrolls the page to the top
            this.addresses = res.data;
            this.paginationService.pagination = res.pagination;
            this.totalPages = res.pagination.total;
          } else {
            this.addresses = [];
          }
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }
}
