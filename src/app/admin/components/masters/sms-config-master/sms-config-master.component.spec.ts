import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfigMasterComponent } from './sms-config-master.component';

describe('SmsConfigMasterComponent', () => {
  let component: SmsConfigMasterComponent;
  let fixture: ComponentFixture<SmsConfigMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsConfigMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsConfigMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
