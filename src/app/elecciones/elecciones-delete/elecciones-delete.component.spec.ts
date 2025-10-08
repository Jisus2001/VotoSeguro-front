import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionesDeleteComponent } from './elecciones-delete.component';

describe('EleccionesDeleteComponent', () => {
  let component: EleccionesDeleteComponent;
  let fixture: ComponentFixture<EleccionesDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleccionesDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleccionesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
