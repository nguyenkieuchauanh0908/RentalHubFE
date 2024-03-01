import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePostsComponent } from './favorite-posts.component';

describe('FavoritePostsComponent', () => {
  let component: FavoritePostsComponent;
  let fixture: ComponentFixture<FavoritePostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritePostsComponent]
    });
    fixture = TestBed.createComponent(FavoritePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
