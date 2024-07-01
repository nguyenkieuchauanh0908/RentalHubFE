import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultAccountComponent } from './search-result-account.component';

describe('SearchResultAccountComponent', () => {
  let component: SearchResultAccountComponent;
  let fixture: ComponentFixture<SearchResultAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultAccountComponent]
    });
    fixture = TestBed.createComponent(SearchResultAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
