import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTheftComponent } from './total-theft.component';

describe('TotalTheftComponent', () => {
  let component: TotalTheftComponent;
  let fixture: ComponentFixture<TotalTheftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalTheftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTheftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
