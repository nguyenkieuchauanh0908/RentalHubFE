import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCardComponent } from './host-card.component';

describe('HostCardComponent', () => {
  let component: HostCardComponent;
  let fixture: ComponentFixture<HostCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostCardComponent]
    });
    fixture = TestBed.createComponent(HostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
