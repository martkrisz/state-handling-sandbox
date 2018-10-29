import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReduxStoredComponent } from './redux-stored.component';

describe('ReduxStoredComponent', () => {
  let component: ReduxStoredComponent;
  let fixture: ComponentFixture<ReduxStoredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReduxStoredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReduxStoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
