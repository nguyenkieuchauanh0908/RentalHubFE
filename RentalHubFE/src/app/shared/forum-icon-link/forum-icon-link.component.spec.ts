import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumIconLinkComponent } from './forum-icon-link.component';

describe('ForumIconLinkComponent', () => {
  let component: ForumIconLinkComponent;
  let fixture: ComponentFixture<ForumIconLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumIconLinkComponent]
    });
    fixture = TestBed.createComponent(ForumIconLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
