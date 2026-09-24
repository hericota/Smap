import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OcorrenciaDetalheAdmin } from './ocorrencia-detalhe-admin';

describe('OcorrenciaDetalheAdmin', () => {
  let component: OcorrenciaDetalheAdmin;
  let fixture: ComponentFixture<OcorrenciaDetalheAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciaDetalheAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(OcorrenciaDetalheAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
