import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeOptionDialogComponent } from './customize-option-dialog.component';

describe('CustomizeOptionDialogComponent', () => {
  let component: CustomizeOptionDialogComponent;
  let fixture: ComponentFixture<CustomizeOptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeOptionDialogComponent]
    });
    fixture = TestBed.createComponent(CustomizeOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
