import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLossByTheftComponent } from './total-loss-by-theft.component';

describe('TotalLossByTheftComponent', () => {
  let component: TotalLossByTheftComponent;
  let fixture: ComponentFixture<TotalLossByTheftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLossByTheftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalLossByTheftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
