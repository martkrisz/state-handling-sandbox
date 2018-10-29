import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStoredComponent } from './service-stored.component';

describe('ServiceStoredComponent', () => {
  let component: ServiceStoredComponent;
  let fixture: ComponentFixture<ServiceStoredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceStoredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
