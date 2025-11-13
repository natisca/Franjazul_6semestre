import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugaresModal } from './lugares-modal';

describe('LugaresModal', () => {
  let component: LugaresModal;
  let fixture: ComponentFixture<LugaresModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LugaresModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugaresModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
