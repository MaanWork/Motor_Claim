import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimofficierListComponent } from './claimofficier-list.component';

describe('ClaimofficierListComponent', () => {
  let component: ClaimofficierListComponent;
  let fixture: ComponentFixture<ClaimofficierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimofficierListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimofficierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
