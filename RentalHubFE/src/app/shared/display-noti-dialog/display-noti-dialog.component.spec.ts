import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNotiDialogComponent } from './display-noti-dialog.component';

describe('DisplayNotiDialogComponent', () => {
  let component: DisplayNotiDialogComponent;
  let fixture: ComponentFixture<DisplayNotiDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayNotiDialogComponent]
    });
    fixture = TestBed.createComponent(DisplayNotiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
