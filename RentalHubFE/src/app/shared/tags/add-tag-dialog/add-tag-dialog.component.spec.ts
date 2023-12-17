import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagDialogComponent } from './add-tag-dialog.component';

describe('AddTagDialogComponent', () => {
  let component: AddTagDialogComponent;
  let fixture: ComponentFixture<AddTagDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTagDialogComponent]
    });
    fixture = TestBed.createComponent(AddTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
