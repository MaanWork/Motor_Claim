import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorGridComponent } from './surveyor-grid.component';

describe('SurveyorGridComponent', () => {
  let component: SurveyorGridComponent;
  let fixture: ComponentFixture<SurveyorGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyorGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
