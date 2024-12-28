import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossSelectionComponent } from './loss-selection.component';

describe('LossSelectionComponent', () => {
  let component: LossSelectionComponent;
  let fixture: ComponentFixture<LossSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
