import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogingarageComponent } from './logingarage.component';

describe('LogingarageComponent', () => {
  let component: LogingarageComponent;
  let fixture: ComponentFixture<LogingarageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogingarageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogingarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
