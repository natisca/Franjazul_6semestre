import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoServiciosModal } from './tipo-servicios-modal';

describe('TipoServiciosModal', () => {
  let component: TipoServiciosModal;
  let fixture: ComponentFixture<TipoServiciosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoServiciosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoServiciosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
