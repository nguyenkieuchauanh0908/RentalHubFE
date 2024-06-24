import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCommentDialogComponent } from './post-comment-dialog.component';

describe('PostCommentDialogComponent', () => {
  let component: PostCommentDialogComponent;
  let fixture: ComponentFixture<PostCommentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostCommentDialogComponent]
    });
    fixture = TestBed.createComponent(PostCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
