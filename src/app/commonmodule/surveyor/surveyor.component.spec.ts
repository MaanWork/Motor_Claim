import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorComponent } from './surveyor.component';

describe('SurveyorComponent', () => {
  let component: SurveyorComponent;
  let fixture: ComponentFixture<SurveyorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
