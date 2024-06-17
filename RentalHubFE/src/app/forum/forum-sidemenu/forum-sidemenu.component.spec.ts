import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumSidemenuComponent } from './forum-sidemenu.component';

describe('ForumSidemenuComponent', () => {
  let component: ForumSidemenuComponent;
  let fixture: ComponentFixture<ForumSidemenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumSidemenuComponent]
    });
    fixture = TestBed.createComponent(ForumSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
