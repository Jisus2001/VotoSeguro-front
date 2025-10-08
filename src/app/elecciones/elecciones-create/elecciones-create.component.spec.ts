import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionesCreateComponent } from './elecciones-create.component';

describe('EleccionesCreateComponent', () => {
  let component: EleccionesCreateComponent;
  let fixture: ComponentFixture<EleccionesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleccionesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleccionesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
