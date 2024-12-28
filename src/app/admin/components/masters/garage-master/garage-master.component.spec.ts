import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageMasterComponent } from './garage-master.component';

describe('GarageMasterComponent', () => {
  let component: GarageMasterComponent;
  let fixture: ComponentFixture<GarageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GarageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
