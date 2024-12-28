import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDeductDetailsComponent } from './claim-deduct-details.component';

describe('ClaimDeductDetailsComponent', () => {
  let component: ClaimDeductDetailsComponent;
  let fixture: ComponentFixture<ClaimDeductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimDeductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDeductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
