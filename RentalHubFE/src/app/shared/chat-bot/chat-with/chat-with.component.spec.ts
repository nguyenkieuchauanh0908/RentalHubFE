import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithComponent } from './chat-with.component';

describe('ChatWithComponent', () => {
  let component: ChatWithComponent;
  let fixture: ComponentFixture<ChatWithComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatWithComponent]
    });
    fixture = TestBed.createComponent(ChatWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
