import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcercaDeNosotros } from './acerca-de-nosotros';

describe('AcercaDeNosotros', () => {
  let component: AcercaDeNosotros;
  let fixture: ComponentFixture<AcercaDeNosotros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcercaDeNosotros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcercaDeNosotros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
