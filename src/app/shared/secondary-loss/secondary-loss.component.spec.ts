import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryLossComponent } from './secondary-loss.component';

describe('SecondaryLossComponent', () => {
  let component: SecondaryLossComponent;
  let fixture: ComponentFixture<SecondaryLossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondaryLossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
