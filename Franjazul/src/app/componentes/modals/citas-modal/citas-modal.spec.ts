import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasModal } from './citas-modal';

describe('CitasModal', () => {
  let component: CitasModal;
  let fixture: ComponentFixture<CitasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
