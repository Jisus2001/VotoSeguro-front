import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedesDeleteComponent } from './sedes-delete.component';

describe('SedesDeleteComponent', () => {
  let component: SedesDeleteComponent;
  let fixture: ComponentFixture<SedesDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SedesDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
