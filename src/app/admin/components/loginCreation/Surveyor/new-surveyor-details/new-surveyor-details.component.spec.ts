import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSurveyorDetailsComponent } from './new-surveyor-details.component';

describe('NewSurveyorDetailsComponent', () => {
  let component: NewSurveyorDetailsComponent;
  let fixture: ComponentFixture<NewSurveyorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSurveyorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSurveyorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
