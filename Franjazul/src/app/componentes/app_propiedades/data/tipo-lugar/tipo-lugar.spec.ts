import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoLugar } from './tipo-lugar';

describe('TipoLugar', () => {
  let component: TipoLugar;
  let fixture: ComponentFixture<TipoLugar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoLugar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoLugar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
