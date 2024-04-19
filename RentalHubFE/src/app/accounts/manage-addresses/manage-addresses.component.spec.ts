import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAddressesComponent } from './manage-addresses.component';

describe('ManageAddressesComponent', () => {
  let component: ManageAddressesComponent;
  let fixture: ComponentFixture<ManageAddressesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAddressesComponent]
    });
    fixture = TestBed.createComponent(ManageAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
