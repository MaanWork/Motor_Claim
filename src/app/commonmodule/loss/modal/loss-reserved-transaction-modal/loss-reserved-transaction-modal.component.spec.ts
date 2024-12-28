import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossReservedTransactionModalComponent } from './loss-reserved-transaction-modal.component';

describe('LossReservedTransactionModalComponent', () => {
  let component: LossReservedTransactionModalComponent;
  let fixture: ComponentFixture<LossReservedTransactionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossReservedTransactionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossReservedTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
