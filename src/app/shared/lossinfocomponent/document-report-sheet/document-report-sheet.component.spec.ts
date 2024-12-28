import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReportSheetComponent } from './document-report-sheet.component';

describe('DocumentReportSheetComponent', () => {
  let component: DocumentReportSheetComponent;
  let fixture: ComponentFixture<DocumentReportSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentReportSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReportSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
