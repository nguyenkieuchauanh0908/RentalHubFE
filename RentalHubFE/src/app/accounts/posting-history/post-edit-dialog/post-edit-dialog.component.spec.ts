import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditDialogComponent } from './post-edit-dialog.component';

describe('PostEditDialogComponent', () => {
  let component: PostEditDialogComponent;
  let fixture: ComponentFixture<PostEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostEditDialogComponent]
    });
    fixture = TestBed.createComponent(PostEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
