import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAuthLetterComponent } from './pending-auth-letter.component';

describe('PendingAuthLetterComponent', () => {
  let component: PendingAuthLetterComponent;
  let fixture: ComponentFixture<PendingAuthLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingAuthLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAuthLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
