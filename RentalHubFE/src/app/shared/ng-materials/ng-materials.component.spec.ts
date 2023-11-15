import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMaterialsComponent } from './ng-materials.component';

describe('NgMaterialsComponent', () => {
  let component: NgMaterialsComponent;
  let fixture: ComponentFixture<NgMaterialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgMaterialsComponent]
    });
    fixture = TestBed.createComponent(NgMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
