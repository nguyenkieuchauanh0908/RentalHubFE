import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumHeaderComponent } from './forum-header.component';

describe('ForumHeaderComponent', () => {
  let component: ForumHeaderComponent;
  let fixture: ComponentFixture<ForumHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumHeaderComponent]
    });
    fixture = TestBed.createComponent(ForumHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
