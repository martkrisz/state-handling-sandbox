import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStoredComponent } from './custom-stored.component';

describe('CustomStoredComponent', () => {
  let component: CustomStoredComponent;
  let fixture: ComponentFixture<CustomStoredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomStoredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomStoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
