import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesIndexComponent } from './perfiles-index.component';

describe('PerfilesIndexComponent', () => {
  let component: PerfilesIndexComponent;
  let fixture: ComponentFixture<PerfilesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
