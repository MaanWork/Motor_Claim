import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossDocumentAiModalComponent } from './loss-document-ai-modal.component';

describe('LossDocumentAiModalComponent', () => {
  let component: LossDocumentAiModalComponent;
  let fixture: ComponentFixture<LossDocumentAiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossDocumentAiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossDocumentAiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
