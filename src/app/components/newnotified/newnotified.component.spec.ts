import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewnotifiedComponent } from './newnotified.component';

describe('NewnotifiedComponent', () => {
  let component: NewnotifiedComponent;
  let fixture: ComponentFixture<NewnotifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewnotifiedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewnotifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
