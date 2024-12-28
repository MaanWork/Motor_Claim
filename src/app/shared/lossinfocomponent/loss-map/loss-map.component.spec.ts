import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossMapComponent } from './loss-map.component';

describe('LossMapComponent', () => {
  let component: LossMapComponent;
  let fixture: ComponentFixture<LossMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
