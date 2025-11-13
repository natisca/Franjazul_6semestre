import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoServicios } from './tipo-servicios';

describe('TipoServicios', () => {
  let component: TipoServicios;
  let fixture: ComponentFixture<TipoServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoServicios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoServicios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
