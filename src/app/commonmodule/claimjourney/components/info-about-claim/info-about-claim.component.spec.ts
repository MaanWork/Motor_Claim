import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAboutClaimComponent } from './info-about-claim.component';

describe('InfoAboutClaimComponent', () => {
  let component: InfoAboutClaimComponent;
  let fixture: ComponentFixture<InfoAboutClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoAboutClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAboutClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
