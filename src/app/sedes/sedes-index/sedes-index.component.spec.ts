import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedesIndexComponent } from './sedes-index.component';

describe('SedesIndexComponent', () => {
  let component: SedesIndexComponent;
  let fixture: ComponentFixture<SedesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SedesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
