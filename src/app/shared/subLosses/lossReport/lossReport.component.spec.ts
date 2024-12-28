import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossReportComponent } from './lossReport.component';

describe('TPLDeathComponent', () => {
  let component: LossReportComponent;
  let fixture: ComponentFixture<LossReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
