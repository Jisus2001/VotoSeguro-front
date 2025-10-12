import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesDeleteComponent } from './perfiles-delete.component';

describe('PerfilesDeleteComponent', () => {
  let component: PerfilesDeleteComponent;
  let fixture: ComponentFixture<PerfilesDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
