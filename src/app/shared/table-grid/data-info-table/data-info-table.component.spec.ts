import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInfoTableComponent } from './data-info-table.component';

describe('DataInfoTableComponent', () => {
  let component: DataInfoTableComponent;
  let fixture: ComponentFixture<DataInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataInfoTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
