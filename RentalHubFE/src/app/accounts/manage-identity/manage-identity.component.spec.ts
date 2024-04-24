import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIdentityComponent } from './manage-identity.component';

describe('ManageIdentityComponent', () => {
  let component: ManageIdentityComponent;
  let fixture: ComponentFixture<ManageIdentityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageIdentityComponent]
    });
    fixture = TestBed.createComponent(ManageIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
