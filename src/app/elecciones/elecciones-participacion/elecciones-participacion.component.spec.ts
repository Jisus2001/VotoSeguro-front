import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionesParticipacionComponent } from './elecciones-participacion.component';

describe('EleccionesParticipacionComponent', () => {
  let component: EleccionesParticipacionComponent;
  let fixture: ComponentFixture<EleccionesParticipacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleccionesParticipacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleccionesParticipacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
