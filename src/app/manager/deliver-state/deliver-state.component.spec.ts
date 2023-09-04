import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverStateComponent } from './deliver-state.component';

describe('DeliverStateComponent', () => {
  let component: DeliverStateComponent;
  let fixture: ComponentFixture<DeliverStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliverStateComponent]
    });
    fixture = TestBed.createComponent(DeliverStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
