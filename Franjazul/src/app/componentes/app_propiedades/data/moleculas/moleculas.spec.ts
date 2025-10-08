import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moleculas } from './moleculas';

describe('Moleculas', () => {
  let component: Moleculas;
  let fixture: ComponentFixture<Moleculas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moleculas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Moleculas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
