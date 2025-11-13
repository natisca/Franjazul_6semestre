import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaServiciosModal } from './cita-servicios-modal';

describe('CitaServiciosModal', () => {
  let component: CitaServiciosModal;
  let fixture: ComponentFixture<CitaServiciosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaServiciosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaServiciosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
