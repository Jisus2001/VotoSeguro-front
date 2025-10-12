import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionesDetailComponent } from './elecciones-detail.component';

describe('EleccionesDetailComponent', () => {
  let component: EleccionesDetailComponent;
  let fixture: ComponentFixture<EleccionesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleccionesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleccionesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
