import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailMasterComponent } from './mail-master.component';

describe('MailMasterComponent', () => {
  let component: MailMasterComponent;
  let fixture: ComponentFixture<MailMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
