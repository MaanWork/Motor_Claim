import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossAccidentFileComponent } from './loss-accident-file.component';

describe('LossAccidentFileComponent', () => {
  let component: LossAccidentFileComponent;
  let fixture: ComponentFixture<LossAccidentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossAccidentFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossAccidentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
