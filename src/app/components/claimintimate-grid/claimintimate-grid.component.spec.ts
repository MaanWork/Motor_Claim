import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimintimateGridComponent } from './claimintimate-grid.component';

describe('ClaimintimateGridComponent', () => {
  let component: ClaimintimateGridComponent;
  let fixture: ComponentFixture<ClaimintimateGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimintimateGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimintimateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
