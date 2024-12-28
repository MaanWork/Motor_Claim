import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossTypeMasterComponent } from './loss-type-master.component';

describe('LossTypeMasterComponent', () => {
  let component: LossTypeMasterComponent;
  let fixture: ComponentFixture<LossTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
