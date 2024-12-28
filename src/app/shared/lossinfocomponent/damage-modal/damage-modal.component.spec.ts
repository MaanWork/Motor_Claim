import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageModalComponent } from './damage-modal.component';

describe('DamageModalComponent', () => {
  let component: DamageModalComponent;
  let fixture: ComponentFixture<DamageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
