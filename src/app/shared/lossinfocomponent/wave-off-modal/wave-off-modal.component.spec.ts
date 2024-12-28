import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveOffModalComponent } from './wave-off-modal.component';

describe('WaveOffModalComponent', () => {
  let component: WaveOffModalComponent;
  let fixture: ComponentFixture<WaveOffModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaveOffModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveOffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
