import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoModal } from './permiso-modal';

describe('PermisoModal', () => {
  let component: PermisoModal;
  let fixture: ComponentFixture<PermisoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
