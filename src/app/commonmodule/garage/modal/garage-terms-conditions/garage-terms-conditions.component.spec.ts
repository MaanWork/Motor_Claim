import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageTermsConditionsComponent } from './garage-terms-conditions.component';

describe('GarageTermsConditionsComponent', () => {
  let component: GarageTermsConditionsComponent;
  let fixture: ComponentFixture<GarageTermsConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GarageTermsConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
