import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OcorrenciaDetalhes } from './ocorrencia-detalhe-admin';

describe('OcorrenciaDetalhes', () => {
  let component: OcorrenciaDetalhes;
  let fixture: ComponentFixture<OcorrenciaDetalhes>;
  let httpTesting: HttpTestingController;
  const paramMap = new BehaviorSubject(convertToParamMap({ id: '1' }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciaDetalhes],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '1' }) },
            paramMap,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OcorrenciaDetalhes);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request the new occurrence when the route id changes', async () => {
    fixture.detectChanges();

    httpTesting.expectOne((request) => request.url.endsWith('/ocorrencias/1')).flush({
      id: 1,
      titulo: 'Primeira',
      descricao: 'Teste',
      categoria: 'vias',
      localizacao: 'Centro',
      latitude: null,
      longitude: null,
      criadaEm: '2026-09-28T12:00:00',
    });

    paramMap.next(convertToParamMap({ id: '2' }));
    await fixture.whenStable();

    httpTesting.expectOne((request) => request.url.endsWith('/ocorrencias/2')).flush({
      id: 2,
      titulo: 'Segunda',
      descricao: 'Teste',
      categoria: 'vias',
      localizacao: 'Centro',
      latitude: null,
      longitude: null,
      criadaEm: '2026-09-28T12:00:00',
    });
  });
});
