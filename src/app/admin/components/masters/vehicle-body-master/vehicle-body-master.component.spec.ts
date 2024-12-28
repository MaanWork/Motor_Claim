import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBodyMasterComponent } from './vehicle-body-master.component';

describe('VehicleBodyMasterComponent', () => {
  let component: VehicleBodyMasterComponent;
  let fixture: ComponentFixture<VehicleBodyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleBodyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBodyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
