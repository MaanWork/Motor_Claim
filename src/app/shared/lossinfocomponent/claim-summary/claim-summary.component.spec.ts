import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSummaryComponent } from './claim-summary.component';

describe('ClaimSummaryComponent', () => {
  let component: ClaimSummaryComponent;
  let fixture: ComponentFixture<ClaimSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
