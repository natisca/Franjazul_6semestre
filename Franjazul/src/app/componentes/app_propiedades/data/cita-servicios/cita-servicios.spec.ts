import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaServicios } from './cita-servicios';

describe('CitaServicios', () => {
  let component: CitaServicios;
  let fixture: ComponentFixture<CitaServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaServicios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaServicios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
