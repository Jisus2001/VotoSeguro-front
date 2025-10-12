import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesCreateComponent } from './perfiles-create.component';

describe('PerfilesCreateComponent', () => {
  let component: PerfilesCreateComponent;
  let fixture: ComponentFixture<PerfilesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
