import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyTypeMasterComponent } from './party-type-master.component';

describe('PartyTypeMasterComponent', () => {
  let component: PartyTypeMasterComponent;
  let fixture: ComponentFixture<PartyTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
