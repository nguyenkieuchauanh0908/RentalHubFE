import { Component, EventEmitter, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Address } from '../../register-address/address.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AddressesService } from '../../register-address/addresses.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.component.html',
  styleUrls: ['./address-detail.component.scss'],
})
export class AddressDetailComponent {
  closeAddress: EventEmitter<any> = new EventEmitter();
  reopenAddress: EventEmitter<any> = new EventEmitter();
  isLoading = false;
  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];

  addressDetailForm = this.formBuilder.group({
    addressInputControl: [{ value: '', disabled: true }, Validators.required],
    inspectorIdInputControl: [
      { value: '', disabled: true },
      Validators.required,
    ],
    reasonInputControl: [{ value: '', disabled: true }, Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private addressesService: AddressesService,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: Address
  ) {
    this.previews = this.data._imgLicense;
    if (this.data) {
      this.addressDetailForm.patchValue({
        addressInputControl: this.data._address.toString(),
        inspectorIdInputControl: this.data._inspectorId?.toString(),
        reasonInputControl: this.data._reason?.toString(),
      });
    }
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
              this.reopenAddress.emit();
            } else {
              if (status === 3) {
                this.closeAddress.emit();
              }
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
  }
}
