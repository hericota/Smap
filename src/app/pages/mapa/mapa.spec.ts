import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { vi } from 'vitest';
import { Mapa } from './mapa';
import { environment } from '../../../environments/environment';

describe('Mapa API', () => {
  const url = `${environment.apiUrl}/ocorrencias`;
  const registro = {
    id: 7, titulo: 'Buraco', categoria: 'Vias públicas',
    descricao: 'Buraco na esquina da rua', localizacao: 'Rua das Flores',
    latitude: -26.3, longitude: -48.8, criadaEm: '2026-09-23T12:00:00Z',
  };
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });
  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function abrir() {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    http.expectOne(url).flush([registro]);
    await fixture.whenStable();
    return fixture;
  }

  async function preencher(fixture: Awaited<ReturnType<typeof abrir>>) {
    fixture.componentInstance.ocorrenciaModel.set({ ...registro, id: undefined });
    fixture.componentInstance.ponto.set({ latitude: -26.3, longitude: -48.8 });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
  }

  it('loads reports from the API and renders their markers', async () => {
    const fixture = await abrir();
    expect(fixture.componentInstance.ocorrencias()).toEqual([registro]);
    expect(fixture.nativeElement.querySelectorAll('.leaflet-interactive').length).toBe(1);
    fixture.destroy();
  });

  it.each(['invalid JSON', 'legacy schema', 'blocked storage'])('saves regardless of %s in browser storage', async (scenario) => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      if (scenario === 'blocked storage') throw new DOMException('Blocked', 'SecurityError');
      return scenario === 'invalid JSON' ? '{broken' : '[{"categoria":"Outros"}]';
    });
    const fixture = await abrir();
    const form = await preencher(fixture);
    const component = fixture.componentInstance;
    component.cadastrar(form);
    component.cadastrar(form);
    const request = http.expectOne({ method: 'POST', url });
    expect(request.request.body.id).toBeUndefined();
    expect(request.request.body.latitude).toBe(-26.3);
    expect(component.salvando()).toBe(true);
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
    request.flush({ ...registro, id: 8 });
    expect(component.salvando()).toBe(false);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/confirmacao-ocorrencia']);
    expect(read).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('preserves the form and location after a failed POST and allows retry', async () => {
    const fixture = await abrir();
    const form = await preencher(fixture);
    const component = fixture.componentInstance;
    component.cadastrar(form);
    http.expectOne({ method: 'POST', url }).error(new ProgressEvent('error'));
    expect(component.erro()).toContain('conectar à API');
    expect(component.ocorrenciaModel().descricao).toBe(registro.descricao);
    expect(component.ponto()?.longitude).toBe(-48.8);
    expect(component.salvando()).toBe(false);
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
    component.cadastrar(form);
    http.expectOne({ method: 'POST', url }).flush(registro);
    fixture.destroy();
  });

  it('allows saving even when listing fails and offers a list retry', async () => {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    http.expectOne(url).flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    expect(fixture.componentInstance.erroCarregamento()).toContain('API');
    const form = await preencher(fixture);
    fixture.componentInstance.cadastrar(form);
    http.expectOne({ method: 'POST', url }).flush(registro);
    fixture.componentInstance.carregar();
    http.expectOne({ method: 'GET', url }).flush([registro]);
    expect(fixture.componentInstance.erroCarregamento()).toBe('');
    fixture.destroy();
  });

  it('ignores invalid coordinates when drawing server reports', () => {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    http.expectOne(url).flush([registro, { ...registro, id: 8, latitude: null }, { ...registro, id: 9, longitude: 190 }]);
    expect(fixture.componentInstance.ocorrencias()).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('.leaflet-interactive').length).toBe(1);
    fixture.destroy();
  });

  it('handles location permission denial', async () => {
    vi.stubGlobal('navigator', {
      userAgent: navigator.userAgent,
      geolocation: {
        getCurrentPosition: (_: PositionCallback, error: PositionErrorCallback) => error({ code: 1 } as GeolocationPositionError),
      },
    });
    const fixture = await abrir();
    fixture.componentInstance.localizar();
    expect(fixture.componentInstance.ponto()).toBeNull();
    expect(fixture.componentInstance.erro()).toContain('negada');
    fixture.destroy();
  });
});
