import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageInformationComponent } from './garage-information.component';

describe('GarageInformationComponent', () => {
  let component: GarageInformationComponent;
  let fixture: ComponentFixture<GarageInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GarageInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
