import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossDmagePartsComponent } from './loss-dmage-parts.component';

describe('LossDmagePartsComponent', () => {
  let component: LossDmagePartsComponent;
  let fixture: ComponentFixture<LossDmagePartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossDmagePartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossDmagePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
