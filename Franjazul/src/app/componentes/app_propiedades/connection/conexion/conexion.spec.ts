import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conexion } from './conexion';

describe('Conexion', () => {
  let component: Conexion;
  let fixture: ComponentFixture<Conexion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conexion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Conexion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
