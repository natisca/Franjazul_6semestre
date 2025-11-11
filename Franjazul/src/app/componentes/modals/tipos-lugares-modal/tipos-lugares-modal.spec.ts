import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposLugaresModal } from './tipos-lugares-modal';

describe('TiposLugaresModal', () => {
  let component: TiposLugaresModal;
  let fixture: ComponentFixture<TiposLugaresModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposLugaresModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposLugaresModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
