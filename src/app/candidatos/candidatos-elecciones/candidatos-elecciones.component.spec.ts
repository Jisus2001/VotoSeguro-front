import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosEleccionesComponent } from './candidatos-elecciones.component';

describe('CandidatosEleccionesComponent', () => {
  let component: CandidatosEleccionesComponent;
  let fixture: ComponentFixture<CandidatosEleccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatosEleccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatosEleccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
