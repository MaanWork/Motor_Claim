import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimIntimateDetailsComponent } from './claim-intimate-details.component';

describe('ClaimIntimateDetailsComponent', () => {
  let component: ClaimIntimateDetailsComponent;
  let fixture: ComponentFixture<ClaimIntimateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimIntimateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimIntimateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
