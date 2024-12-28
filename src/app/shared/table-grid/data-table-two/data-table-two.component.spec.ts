import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTwoComponent } from './data-table-two.component';

describe('DataTableTwoComponent', () => {
  let component: DataTableTwoComponent;
  let fixture: ComponentFixture<DataTableTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
