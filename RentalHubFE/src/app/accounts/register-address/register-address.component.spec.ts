import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAddressComponent } from './register-address.component';

describe('RegisterAddressComponent', () => {
  let component: RegisterAddressComponent;
  let fixture: ComponentFixture<RegisterAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterAddressComponent]
    });
    fixture = TestBed.createComponent(RegisterAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
