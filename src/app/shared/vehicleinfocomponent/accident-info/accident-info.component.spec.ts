import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentInfoComponent } from './accident-info.component';

describe('AccidentInfoComponent', () => {
  let component: AccidentInfoComponent;
  let fixture: ComponentFixture<AccidentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
