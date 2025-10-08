import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotantesDesactivarComponent } from './votantes-desactivar.component';

describe('VotantesDesactivarComponent', () => {
  let component: VotantesDesactivarComponent;
  let fixture: ComponentFixture<VotantesDesactivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotantesDesactivarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotantesDesactivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
