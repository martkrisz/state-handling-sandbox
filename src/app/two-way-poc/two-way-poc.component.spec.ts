import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayPocComponent } from './two-way-poc.component';

describe('TwoWayPocComponent', () => {
  let component: TwoWayPocComponent;
  let fixture: ComponentFixture<TwoWayPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoWayPocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
