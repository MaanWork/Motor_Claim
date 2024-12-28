import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubstatusMasterComponent } from './claim-substatus-master.component';

describe('ClaimSubstatusMasterComponent', () => {
  let component: ClaimSubstatusMasterComponent;
  let fixture: ComponentFixture<ClaimSubstatusMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimSubstatusMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubstatusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
