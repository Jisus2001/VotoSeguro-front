import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosCreateComponent } from './candidatos-create.component';

describe('CandidatosCreateComponent', () => {
  let component: CandidatosCreateComponent;
  let fixture: ComponentFixture<CandidatosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatosCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
