import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCmpyMasterComponent } from './insurance-cmpy-master.component';

describe('InsuranceCmpyMasterComponent', () => {
  let component: InsuranceCmpyMasterComponent;
  let fixture: ComponentFixture<InsuranceCmpyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCmpyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCmpyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
