import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchMasterComponent } from './bank-branch-master.component';

describe('BankBranchMasterComponent', () => {
  let component: BankBranchMasterComponent;
  let fixture: ComponentFixture<BankBranchMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankBranchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
