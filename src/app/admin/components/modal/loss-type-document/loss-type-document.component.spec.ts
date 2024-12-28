import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossTypeDocumentComponent } from './loss-type-document.component';

describe('LossTypeDocumentComponent', () => {
  let component: LossTypeDocumentComponent;
  let fixture: ComponentFixture<LossTypeDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossTypeDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossTypeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
