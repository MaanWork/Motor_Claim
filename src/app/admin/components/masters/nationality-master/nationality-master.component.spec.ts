import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityMasterComponent } from './nationality-master.component';

describe('NationalityMasterComponent', () => {
  let component: NationalityMasterComponent;
  let fixture: ComponentFixture<NationalityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
