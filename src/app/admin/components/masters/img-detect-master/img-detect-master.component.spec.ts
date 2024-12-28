import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgDetectMasterComponent } from './img-detect-master.component';

describe('ImgDetectMasterComponent', () => {
  let component: ImgDetectMasterComponent;
  let fixture: ComponentFixture<ImgDetectMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgDetectMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgDetectMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
