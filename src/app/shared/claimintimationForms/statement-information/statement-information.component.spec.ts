import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementInformationComponent } from './statement-information.component';

describe('StatementInformationComponent', () => {
  let component: StatementInformationComponent;
  let fixture: ComponentFixture<StatementInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
