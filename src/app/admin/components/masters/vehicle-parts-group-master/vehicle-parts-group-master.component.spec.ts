import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePartsGroupMasterComponent } from './vehicle-parts-group-master.component';

describe('VehiclePartsGroupMasterComponent', () => {
  let component: VehiclePartsGroupMasterComponent;
  let fixture: ComponentFixture<VehiclePartsGroupMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclePartsGroupMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePartsGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
