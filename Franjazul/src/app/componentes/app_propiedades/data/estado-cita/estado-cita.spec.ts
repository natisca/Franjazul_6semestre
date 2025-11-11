import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCita } from './estado-cita';

describe('EstadoCita', () => {
  let component: EstadoCita;
  let fixture: ComponentFixture<EstadoCita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoCita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoCita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
