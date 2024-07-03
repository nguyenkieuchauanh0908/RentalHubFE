import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPostDetailComponent } from './forum-post-detail.component';

describe('ForumPostDetailComponent', () => {
  let component: ForumPostDetailComponent;
  let fixture: ComponentFixture<ForumPostDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumPostDetailComponent]
    });
    fixture = TestBed.createComponent(ForumPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
