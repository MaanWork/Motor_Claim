import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimStatusTrackingComponent } from './claim-status-tracking.component';

describe('ClaimStatusTrackingComponent', () => {
  let component: ClaimStatusTrackingComponent;
  let fixture: ComponentFixture<ClaimStatusTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimStatusTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimStatusTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
