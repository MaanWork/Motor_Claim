import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAboutPolicyComponent } from './info-about-policy.component';

describe('InfoAboutPolicyComponent', () => {
  let component: InfoAboutPolicyComponent;
  let fixture: ComponentFixture<InfoAboutPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoAboutPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAboutPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
