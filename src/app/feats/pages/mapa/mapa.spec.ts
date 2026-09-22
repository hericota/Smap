import { TestBed } from '@angular/core/testing';
import { Mapa } from './mapa';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { vi } from 'vitest';

describe('Mapa', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('navigator', Object.create(navigator, {
      geolocation: { configurable: true, get: () => ({ getCurrentPosition: vi.fn() }) },
    }));
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('saves a located report, renders it, and restores it after reopening', async () => {
    vi.spyOn(navigator, 'geolocation', 'get').mockReturnValue({
      getCurrentPosition: (success: PositionCallback) => success({
        coords: { latitude: -26.3, longitude: -48.8, accuracy: 15 },
      } as GeolocationPosition),
    } as Geolocation);
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    await fixture.whenStable();
    const component = fixture.componentInstance;
    component.localizar();
    expect(component.ponto()?.latitude).toBe(-26.3);
    component.categoria = 'Vias públicas';
    component.descricao = 'Buraco na esquina da rua';
    fixture.detectChanges();
    await fixture.whenStable();
    component.cadastrar(fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm));
    expect(component.ocorrencias()).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem('smap.ocorrencias.v1')!)[0].longitude).toBe(-48.8);
    fixture.destroy();
    const reopened = TestBed.createComponent(Mapa);
    reopened.detectChanges();
    expect(reopened.componentInstance.ocorrencias()).toHaveLength(1);
    reopened.destroy();
  });

  it('handles permission denial without selecting a false location', () => {
    vi.spyOn(navigator, 'geolocation', 'get').mockReturnValue({
      getCurrentPosition: (_: PositionCallback, error: PositionErrorCallback) => error({ code: 1 } as GeolocationPositionError),
    } as Geolocation);
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    fixture.componentInstance.localizar();
    expect(fixture.componentInstance.ponto()).toBeNull();
    expect(fixture.componentInstance.erro()).toContain('negada');
    expect(fixture.componentInstance.localizando()).toBe(false);
    fixture.destroy();
  });

  it('creates the interactive map and releases it when leaving the page', async () => {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    await fixture.whenStable();
    const container = fixture.nativeElement.querySelector('.map') as HTMLElement;
    expect(container.classList.contains('leaflet-container')).toBe(true);
    expect(container.querySelector('.leaflet-control-zoom')).not.toBeNull();
    expect(container.querySelector('.leaflet-control-attribution')?.textContent).toContain('OpenStreetMap');
    fixture.destroy();
    expect(container.classList.contains('leaflet-container')).toBe(false);
  });
});
