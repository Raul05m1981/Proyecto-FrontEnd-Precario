import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JorgeComponent } from './jorge.component';

describe('JorgeComponent', () => {
  let component: JorgeComponent;
  let fixture: ComponentFixture<JorgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JorgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JorgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
