import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCityMasterComponent } from './bank-city-master.component';

describe('BankCityMasterComponent', () => {
  let component: BankCityMasterComponent;
  let fixture: ComponentFixture<BankCityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCityMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
