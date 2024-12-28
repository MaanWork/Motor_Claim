import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRedirectComponent } from './session-redirect.component';

describe('SessionRedirectComponent', () => {
  let component: SessionRedirectComponent;
  let fixture: ComponentFixture<SessionRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
