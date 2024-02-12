import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForgetPwEmailComponent } from './send-forget-pw-email.component';

describe('SendForgetPwEmailComponent', () => {
  let component: SendForgetPwEmailComponent;
  let fixture: ComponentFixture<SendForgetPwEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendForgetPwEmailComponent]
    });
    fixture = TestBed.createComponent(SendForgetPwEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
