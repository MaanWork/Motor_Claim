import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAssessorComponent } from './login-assessor.component';

describe('LoginAssessorComponent', () => {
  let component: LoginAssessorComponent;
  let fixture: ComponentFixture<LoginAssessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAssessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAssessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
