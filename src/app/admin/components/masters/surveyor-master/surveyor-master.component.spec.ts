import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorMasterComponent } from './surveyor-master.component';

describe('SurveyorMasterComponent', () => {
  let component: SurveyorMasterComponent;
  let fixture: ComponentFixture<SurveyorMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyorMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
