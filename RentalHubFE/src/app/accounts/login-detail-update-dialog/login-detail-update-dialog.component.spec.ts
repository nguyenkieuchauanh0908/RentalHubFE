import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDetailUpdateDialogComponent } from './login-detail-update-dialog.component';

describe('LoginDetailUpdateDialogComponent', () => {
  let component: LoginDetailUpdateDialogComponent;
  let fixture: ComponentFixture<LoginDetailUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDetailUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(LoginDetailUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
