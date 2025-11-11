import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranjasHorariasModal } from './franjas-horarias-modal';

describe('FranjasHorariasModal', () => {
  let component: FranjasHorariasModal;
  let fixture: ComponentFixture<FranjasHorariasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranjasHorariasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FranjasHorariasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
