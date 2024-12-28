import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartyModalComponent } from './new-party-modal.component';

describe('NewPartyModalComponent', () => {
  let component: NewPartyModalComponent;
  let fixture: ComponentFixture<NewPartyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPartyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPartyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
