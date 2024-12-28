import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementInfoComponent } from './statement-info.component';

describe('StatementInfoComponent', () => {
  let component: StatementInfoComponent;
  let fixture: ComponentFixture<StatementInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
