import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonInformationComponent } from './reason-information.component';

describe('ReasonInformationComponent', () => {
  let component: ReasonInformationComponent;
  let fixture: ComponentFixture<ReasonInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
