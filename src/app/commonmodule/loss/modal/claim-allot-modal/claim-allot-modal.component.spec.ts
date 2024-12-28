import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAllotModalComponent } from './claim-allot-modal.component';

describe('ClaimAllotModalComponent', () => {
  let component: ClaimAllotModalComponent;
  let fixture: ComponentFixture<ClaimAllotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimAllotModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAllotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
