import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonInfoComponent } from './reason-info.component';

describe('ReasonInfoComponent', () => {
  let component: ReasonInfoComponent;
  let fixture: ComponentFixture<ReasonInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
