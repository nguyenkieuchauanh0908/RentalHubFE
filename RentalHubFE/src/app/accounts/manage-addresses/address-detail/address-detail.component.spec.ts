import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailComponent } from './address-detail.component';

describe('AddressDetailComponent', () => {
  let component: AddressDetailComponent;
  let fixture: ComponentFixture<AddressDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressDetailComponent]
    });
    fixture = TestBed.createComponent(AddressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
