import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedesCreateComponent } from './sedes-create.component';

describe('SedesCreateComponent', () => {
  let component: SedesCreateComponent;
  let fixture: ComponentFixture<SedesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SedesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
