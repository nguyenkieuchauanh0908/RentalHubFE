import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritePostCommentFormComponent } from './write-post-comment-form.component';

describe('WritePostCommentFormComponent', () => {
  let component: WritePostCommentFormComponent;
  let fixture: ComponentFixture<WritePostCommentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WritePostCommentFormComponent]
    });
    fixture = TestBed.createComponent(WritePostCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
