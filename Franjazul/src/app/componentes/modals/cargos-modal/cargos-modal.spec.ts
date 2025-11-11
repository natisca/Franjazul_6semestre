import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosModal } from './cargos-modal';

describe('CargosModal', () => {
  let component: CargosModal;
  let fixture: ComponentFixture<CargosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
