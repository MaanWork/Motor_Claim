import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossSurveyorDocumentFileComponent } from './loss-surveyor-document-file.component';

describe('LossSurveyorDocumentFileComponent', () => {
  let component: LossSurveyorDocumentFileComponent;
  let fixture: ComponentFixture<LossSurveyorDocumentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossSurveyorDocumentFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossSurveyorDocumentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
