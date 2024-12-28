import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableOneComponent } from './data-table-one.component';

describe('DataTableOneComponent', () => {
  let component: DataTableOneComponent;
  let fixture: ComponentFixture<DataTableOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
