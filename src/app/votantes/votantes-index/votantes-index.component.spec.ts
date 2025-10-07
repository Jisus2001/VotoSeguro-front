import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotantesIndexComponent } from './votantes-index.component';

describe('VotantesIndexComponent', () => {
  let component: VotantesIndexComponent;
  let fixture: ComponentFixture<VotantesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotantesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotantesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
