import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculasModal } from './moleculas-modal';

describe('MoleculasModal', () => {
  let component: MoleculasModal;
  let fixture: ComponentFixture<MoleculasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoleculasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoleculasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
