import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosDetailComponent } from './candidatos-detail.component';

describe('CandidatosDetailComponent', () => {
  let component: CandidatosDetailComponent;
  let fixture: ComponentFixture<CandidatosDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatosDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
