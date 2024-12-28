import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossDriverDetailsComponent } from './loss-driver-details.component';

describe('LossDriverDetailsComponent', () => {
  let component: LossDriverDetailsComponent;
  let fixture: ComponentFixture<LossDriverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossDriverDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
