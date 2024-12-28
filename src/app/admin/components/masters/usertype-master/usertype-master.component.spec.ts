import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertypeMasterComponent } from './usertype-master.component';

describe('UsertypeMasterComponent', () => {
  let component: UsertypeMasterComponent;
  let fixture: ComponentFixture<UsertypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsertypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
