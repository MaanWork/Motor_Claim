import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageInfoComponent } from './damage-info.component';

describe('DamageInfoComponent', () => {
  let component: DamageInfoComponent;
  let fixture: ComponentFixture<DamageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
