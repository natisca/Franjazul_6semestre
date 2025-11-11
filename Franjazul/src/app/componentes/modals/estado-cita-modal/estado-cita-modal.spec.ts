import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCitaModal } from './estado-cita-modal';

describe('EstadoCitaModal', () => {
  let component: EstadoCitaModal;
  let fixture: ComponentFixture<EstadoCitaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoCitaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoCitaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
