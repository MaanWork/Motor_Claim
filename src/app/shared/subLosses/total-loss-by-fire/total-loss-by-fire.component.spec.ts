import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLossByFireComponent } from './total-loss-by-fire.component';

describe('TotalLossByFireComponent', () => {
  let component: TotalLossByFireComponent;
  let fixture: ComponentFixture<TotalLossByFireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLossByFireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalLossByFireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
