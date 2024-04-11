import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDetailUpdateComponent } from './login-detail-update.component';

describe('LoginDetailUpdateComponent', () => {
  let component: LoginDetailUpdateComponent;
  let fixture: ComponentFixture<LoginDetailUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDetailUpdateComponent]
    });
    fixture = TestBed.createComponent(LoginDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
