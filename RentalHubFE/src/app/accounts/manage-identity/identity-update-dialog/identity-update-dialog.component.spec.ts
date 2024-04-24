import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityUpdateDialogComponent } from './identity-update-dialog.component';

describe('IdentityUpdateDialogComponent', () => {
  let component: IdentityUpdateDialogComponent;
  let fixture: ComponentFixture<IdentityUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdentityUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(IdentityUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
