import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotantesDetailComponent } from './votantes-detail.component';

describe('VotantesDetailComponent', () => {
  let component: VotantesDetailComponent;
  let fixture: ComponentFixture<VotantesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotantesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotantesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
