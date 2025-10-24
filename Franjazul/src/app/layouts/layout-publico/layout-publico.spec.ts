import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPublico } from './layout-publico';

describe('LayoutPublico', () => {
  let component: LayoutPublico;
  let fixture: ComponentFixture<LayoutPublico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPublico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutPublico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
