import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutInterno } from './layout-interno';

describe('LayoutInterno', () => {
  let component: LayoutInterno;
  let fixture: ComponentFixture<LayoutInterno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutInterno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutInterno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
