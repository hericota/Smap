import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConsumoApi } from './consumo-api';

describe('ConsumoApi', () => {
  let service: ConsumoApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConsumoApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created without ActivatedRoute', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a single occurrence by id', () => {
    service.pegarOcorrencia(42).subscribe((ocorrencia) => {
      expect(ocorrencia.id).toBe(42);
      expect(ocorrencia.titulo).toBe('Buraco');
    });

    const request = httpTesting.expectOne((req) => req.url.endsWith('/ocorrencias/42'));
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 42,
      categoria: 'vias',
      descricao: 'Buraco na pista',
      latitude: null,
      longitude: null,
      criadaEm: '2026-09-28T12:00:00',
      titulo: 'Buraco',
      localizacao: 'Centro',
    });
  });
});
