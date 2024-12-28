import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TPLBodyInjuryComponent } from './tplbody-injury.component';

describe('TPLBodyInjuryComponent', () => {
  let component: TPLBodyInjuryComponent;
  let fixture: ComponentFixture<TPLBodyInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TPLBodyInjuryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TPLBodyInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
