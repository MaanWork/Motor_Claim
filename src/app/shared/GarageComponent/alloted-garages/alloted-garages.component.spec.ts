import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotedGaragesComponent } from './alloted-garages.component';

describe('AllotedGaragesComponent', () => {
  let component: AllotedGaragesComponent;
  let fixture: ComponentFixture<AllotedGaragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotedGaragesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotedGaragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
