import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialPostEditDialogComponent } from './social-post-edit-dialog.component';

describe('SocialPostEditDialogComponent', () => {
  let component: SocialPostEditDialogComponent;
  let fixture: ComponentFixture<SocialPostEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialPostEditDialogComponent]
    });
    fixture = TestBed.createComponent(SocialPostEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
