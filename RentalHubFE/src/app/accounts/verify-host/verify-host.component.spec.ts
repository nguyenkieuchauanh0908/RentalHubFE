import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyHostComponent } from './verify-host.component';

describe('VerifyHostComponent', () => {
  let component: VerifyHostComponent;
  let fixture: ComponentFixture<VerifyHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyHostComponent]
    });
    fixture = TestBed.createComponent(VerifyHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
