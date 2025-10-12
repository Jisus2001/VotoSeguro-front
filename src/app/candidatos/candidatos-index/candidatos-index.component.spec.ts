import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosIndexComponent } from './candidatos-index.component';

describe('CandidatosIndexComponent', () => {
  let component: CandidatosIndexComponent;
  let fixture: ComponentFixture<CandidatosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatosIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
