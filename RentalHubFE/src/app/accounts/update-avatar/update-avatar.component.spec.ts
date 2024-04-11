import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvatarComponent } from './update-avatar.component';

describe('UpdateAvatarComponent', () => {
  let component: UpdateAvatarComponent;
  let fixture: ComponentFixture<UpdateAvatarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAvatarComponent]
    });
    fixture = TestBed.createComponent(UpdateAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
