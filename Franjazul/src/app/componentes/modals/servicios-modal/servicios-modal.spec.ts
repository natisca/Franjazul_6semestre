import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosModal } from './servicios-modal';

describe('ServiciosModal', () => {
  let component: ServiciosModal;
  let fixture: ComponentFixture<ServiciosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
