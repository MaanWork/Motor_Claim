import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimintimationComponent } from './claimintimation.component';

describe('ClaimintimationComponent', () => {
  let component: ClaimintimationComponent;
  let fixture: ComponentFixture<ClaimintimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimintimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimintimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
