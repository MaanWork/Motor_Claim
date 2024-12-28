import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeMasterComponent } from './exchange-master.component';

describe('ExchangeMasterComponent', () => {
  let component: ExchangeMasterComponent;
  let fixture: ComponentFixture<ExchangeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
