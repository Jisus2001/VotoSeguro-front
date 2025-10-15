import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosVotacionesComponent } from './candidatos-votaciones.component';

describe('CandidatosVotacionesComponent', () => {
  let component: CandidatosVotacionesComponent;
  let fixture: ComponentFixture<CandidatosVotacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatosVotacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatosVotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
