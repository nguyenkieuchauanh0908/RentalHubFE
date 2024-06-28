import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReplyCommentComponent } from './post-reply-comment.component';

describe('PostReplyCommentComponent', () => {
  let component: PostReplyCommentComponent;
  let fixture: ComponentFixture<PostReplyCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostReplyCommentComponent]
    });
    fixture = TestBed.createComponent(PostReplyCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
