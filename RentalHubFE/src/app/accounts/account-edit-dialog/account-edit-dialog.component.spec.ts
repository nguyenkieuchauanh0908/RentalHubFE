import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditDialogComponent } from './account-edit-dialog.component';

describe('AccountEditDialogComponent', () => {
  let component: AccountEditDialogComponent;
  let fixture: ComponentFixture<AccountEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountEditDialogComponent]
    });
    fixture = TestBed.createComponent(AccountEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
