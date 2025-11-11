import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosModal } from './formularios-modal';

describe('FormulariosModal', () => {
  let component: FormulariosModal;
  let fixture: ComponentFixture<FormulariosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulariosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
