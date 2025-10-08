import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Franjas } from './franjas';

describe('Franjas', () => {
  let component: Franjas;
  let fixture: ComponentFixture<Franjas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Franjas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Franjas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
