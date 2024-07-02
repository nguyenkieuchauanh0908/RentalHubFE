import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, Observable, startWith, map } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { AddTagDialogComponent } from 'src/app/shared/tags/add-tag-dialog/add-tag-dialog.component';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { _filterForStringOptions } from '../posts-edit/posts-edit.component';
import { AddressesService } from '../register-address/addresses.service';
import { Identity } from './identity.model';
import { IdentityUpdateDialogComponent } from './identity-update-dialog/identity-update-dialog.component';

@Component({
  selector: 'app-manage-identity',
  templateUrl: './manage-identity.component.html',
  styleUrls: ['./manage-identity.component.scss'],
})
export class ManageIdentityComponent {
  title = 'Thông tin định danh';
  isLoading = false;
  isHost: boolean = false;
  myProfile!: User | null;

  previews: string[] = [];
  selectedImage!: File;
  selectedFiles!: FileList;
  selectedFileNames: string[] = [];
  updatedFiles!: FileList;
  deletedImageIndexes: number[] = [];
  selectedTags!: Tags[];

  addressOptions: String[] = new Array<string>();
  filteredAddressOptions!: Observable<String[]> | undefined;
  identity!: Identity | null;
  identityCardForm = this.formBuilder.group({
    idCardInputControl: [{ value: '', disabled: true }],
    nameInputControl: [{ value: '', disabled: true }],
    dobInputControl: [{ value: '', disabled: true }],
    homeInputControl: [{ value: '', disabled: true }],
    addressInputControl: [{ value: '', disabled: true }],
    genderInputControl: [{ value: '', disabled: true }],
    nationalityInputControl: [{ value: '', disabled: true }],
    featuresInputControl: [{ value: '', disabled: true }],
    issueDateInputControl: [{ value: '', disabled: true }],
    doeInputControl: [{ value: '', disabled: true }],
    issueLocInputControl: [{ value: '', disabled: true }],
    typeInputControl: [{ value: '', disabled: true }],
  });

  constructor(
    private router: Router,
    private accountService: AccountService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.accountService.getCurrentIDCard.subscribe((currentIDCard) => {
      this.identity = currentIDCard;
    });
    if (!this.identity) {
      this.accountService.getIdentityCard().subscribe((res) => {
        this.isLoading = true;
        if (res.data) {
          this.isLoading = false;
          this.accountService.getCurrentIDCard.subscribe((currentIDCard) => {
            this.identity = currentIDCard;
          });

          //Initiate form value
          this.identityCardForm.patchValue({
            idCardInputControl: this.identity!._idCard,
            nameInputControl: this.identity!._name,
            dobInputControl: this.identity!._dob,
            homeInputControl: this.identity!._home,
            addressInputControl: this.identity!._address,
            genderInputControl: this.identity!._gender,
            nationalityInputControl: this.identity!._nationality,
            featuresInputControl: this.identity!._features,
            issueDateInputControl: this.identity!._issueDate,
            doeInputControl: this.identity!._doe,
            issueLocInputControl: this.identity!._issueLoc,
            typeInputControl: this.identity!._type,
          });
        } else {
          this.identity = null;
        }
      });
    }
  }

  ngOnDestroy(): void {}

  onVerifyAccount() {
    console.log('on verifying account ...');
    let uId = this.myProfile?._id;
    this.router.navigate(['/profile/verify-account/', uId]);
  }

  updateIdentity() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(IdentityUpdateDialogComponent, {
      width: '800px',
      data: 'Cập nhật CCCD',
    });
  }
}
