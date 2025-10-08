import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotantesCreateComponent } from './votantes-create.component';

describe('VotantesCreateComponent', () => {
  let component: VotantesCreateComponent;
  let fixture: ComponentFixture<VotantesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotantesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotantesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
