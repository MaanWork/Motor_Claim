import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLossByAccidentComponent } from './total-loss-by-accident.component';

describe('TotalLossByAccidentComponent', () => {
  let component: TotalLossByAccidentComponent;
  let fixture: ComponentFixture<TotalLossByAccidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLossByAccidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalLossByAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
