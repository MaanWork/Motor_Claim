import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimStatusMasterComponent } from './claim-status-master.component';

describe('ClaimStatusMasterComponent', () => {
  let component: ClaimStatusMasterComponent;
  let fixture: ComponentFixture<ClaimStatusMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimStatusMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimStatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
