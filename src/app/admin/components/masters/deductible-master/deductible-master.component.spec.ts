import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductibleMasterComponent } from './deductible-master.component';

describe('DeductibleMasterComponent', () => {
  let component: DeductibleMasterComponent;
  let fixture: ComponentFixture<DeductibleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductibleMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductibleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
