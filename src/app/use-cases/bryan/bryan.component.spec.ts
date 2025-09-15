import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BryanComponent } from './bryan.component';

describe('BryanComponent', () => {
  let component: BryanComponent;
  let fixture: ComponentFixture<BryanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BryanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BryanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
