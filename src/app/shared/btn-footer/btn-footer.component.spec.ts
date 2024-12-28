import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFooterComponent } from './btn-footer.component';

describe('BtnFooterComponent', () => {
  let component: BtnFooterComponent;
  let fixture: ComponentFixture<BtnFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
