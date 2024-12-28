import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TPLDeathComponent } from './tpldeath.component';

describe('TPLDeathComponent', () => {
  let component: TPLDeathComponent;
  let fixture: ComponentFixture<TPLDeathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TPLDeathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TPLDeathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
