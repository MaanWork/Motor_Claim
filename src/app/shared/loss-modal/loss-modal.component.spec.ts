import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossModalComponent } from './loss-modal.component';

describe('LossModalComponent', () => {
  let component: LossModalComponent;
  let fixture: ComponentFixture<LossModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
