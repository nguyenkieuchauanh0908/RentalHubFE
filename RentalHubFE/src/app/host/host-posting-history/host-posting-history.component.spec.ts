import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPostingHistoryComponent } from './host-posting-history.component';

describe('HostPostingHistoryComponent', () => {
  let component: HostPostingHistoryComponent;
  let fixture: ComponentFixture<HostPostingHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostPostingHistoryComponent]
    });
    fixture = TestBed.createComponent(HostPostingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
