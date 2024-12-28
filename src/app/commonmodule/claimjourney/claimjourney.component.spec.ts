import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimjourneyComponent } from './claimjourney.component';

describe('ClaimjourneyComponent', () => {
  let component: ClaimjourneyComponent;
  let fixture: ComponentFixture<ClaimjourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimjourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
