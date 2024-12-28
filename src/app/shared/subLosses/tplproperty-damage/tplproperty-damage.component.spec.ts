import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TPLPropertyDamageComponent } from './tplproperty-damage.component';

describe('TPLPropertyDamageComponent', () => {
  let component: TPLPropertyDamageComponent;
  let fixture: ComponentFixture<TPLPropertyDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TPLPropertyDamageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TPLPropertyDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
