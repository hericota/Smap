import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OcorrenciasRegistradas } from './ocorrencias-registradas';

describe('OcorrenciasRegistradas', () => {
  let component: OcorrenciasRegistradas;
  let fixture: ComponentFixture<OcorrenciasRegistradas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciasRegistradas],
    }).compileComponents();

    fixture = TestBed.createComponent(OcorrenciasRegistradas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
