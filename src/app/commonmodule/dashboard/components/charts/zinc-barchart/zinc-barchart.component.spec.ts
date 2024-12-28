import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZincBarchartComponent } from './zinc-barchart.component';

describe('ZincBarchartComponent', () => {
  let component: ZincBarchartComponent;
  let fixture: ComponentFixture<ZincBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZincBarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZincBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
