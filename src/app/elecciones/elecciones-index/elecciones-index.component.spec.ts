import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionesIndexComponent } from './elecciones-index.component';

describe('EleccionesIndexComponent', () => {
  let component: EleccionesIndexComponent;
  let fixture: ComponentFixture<EleccionesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleccionesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleccionesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
