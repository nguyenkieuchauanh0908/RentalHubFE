import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
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
  //Status địa chỉ: 0: Chờ duyệt 1: Được duyệt 2: Không được duyệt 3: Đã gỡ
  $destroy: Subject<boolean> = new Subject();
  title!: string;
  profile!: User | null;
  myProfile!: User | null;
  addresses: Address[] = new Array<Address>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  previews: string[] = [];
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];
  imageInfos?: Observable<any>;

  isLoading: boolean = false;
  currentActiveStatus = {
    status: 0, //Chờ duyệt
    data: this.addresses,
  };

  constructor(
    private accountService: AccountService,
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
          this.currentActiveStatus.status = 0;
          this.myProfile = user;
          this.addressesService
            .getAddresses(
              this.currentActiveStatus.status,
              1,
              this.pageItemLimit
            )
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
    this.currentPage = 1;
    this.currentActiveStatus.status = 0;
    this.addresses = [];
    this.isLoading = true;
    this.getAddressesByStatus(this.currentActiveStatus.status);
  }

  //Status = 2
  toUnsensoredAddresses() {
    this.currentPage = 1;
    this.addresses = [];
    this.isLoading = true;
    this.currentActiveStatus.status = 2;
    this.getAddressesByStatus(this.currentActiveStatus.status);
  }

  //Status = 1
  toSensoredAddresses() {
    this.currentPage = 1;
    this.currentActiveStatus.status = 1;
    this.addresses = [];
    this.isLoading = true;
    this.getAddressesByStatus(this.currentActiveStatus.status);
  }

  //Status = 3
  toUnsuedAddresses() {
    this.currentPage = 1;
    this.currentActiveStatus.status = 3;
    this.isLoading = true;
    this.addresses = [];
    this.addressesService
      .getAddresses(
        this.currentActiveStatus.status,
        this.currentPage,
        this.pageItemLimit
      )
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
    this.getAddressesByStatus(this.currentActiveStatus.status);
  }

  getAddressesByStatus(status: number) {
    this.addressesService
      .getAddresses(status, this.currentPage, this.pageItemLimit)
      .pipe(takeUntil(this.$destroy))
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
}
