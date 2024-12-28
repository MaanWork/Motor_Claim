import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageviewModalComponent } from './imageview-modal.component';

describe('ImageviewModalComponent', () => {
  let component: ImageviewModalComponent;
  let fixture: ComponentFixture<ImageviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
