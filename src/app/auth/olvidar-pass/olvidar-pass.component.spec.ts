import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidarPassComponent } from './olvidar-pass.component';

describe('OlvidarPassComponent', () => {
  let component: OlvidarPassComponent;
  let fixture: ComponentFixture<OlvidarPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlvidarPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlvidarPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
