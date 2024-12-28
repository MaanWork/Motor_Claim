import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLossModalComponent } from './new-loss-modal.component';

describe('NewLossModalComponent', () => {
  let component: NewLossModalComponent;
  let fixture: ComponentFixture<NewLossModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLossModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLossModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
