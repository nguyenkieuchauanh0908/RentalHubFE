import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCommentEditDialogComponent } from './post-comment-edit-dialog.component';

describe('PostCommentEditDialogComponent', () => {
  let component: PostCommentEditDialogComponent;
  let fixture: ComponentFixture<PostCommentEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostCommentEditDialogComponent]
    });
    fixture = TestBed.createComponent(PostCommentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
