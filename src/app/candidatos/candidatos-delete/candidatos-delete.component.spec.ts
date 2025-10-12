import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosDeleteComponent } from './candidatos-delete.component';

describe('CandidatosDeleteComponent', () => {
  let component: CandidatosDeleteComponent;
  let fixture: ComponentFixture<CandidatosDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatosDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatosDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
