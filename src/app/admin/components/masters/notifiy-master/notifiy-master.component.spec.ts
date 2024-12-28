import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiyMasterComponent } from './notifiy-master.component';

describe('NotifiyMasterComponent', () => {
  let component: NotifiyMasterComponent;
  let fixture: ComponentFixture<NotifiyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifiyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifiyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
