import { TestBed } from '@angular/core/testing';
import { ConsumoApi } from './consumo-api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ConsumoApi', () => {
  let service: ConsumoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ConsumoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
