import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossDocumentFileComponent } from './loss-document-file.component';

describe('LossDocumentFileComponent', () => {
  let component: LossDocumentFileComponent;
  let fixture: ComponentFixture<LossDocumentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossDocumentFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossDocumentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
