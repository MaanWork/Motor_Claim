import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversDetailsComponent } from './drivers-details.component';

describe('DriversDetailsComponent', () => {
  let component: DriversDetailsComponent;
  let fixture: ComponentFixture<DriversDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriversDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
