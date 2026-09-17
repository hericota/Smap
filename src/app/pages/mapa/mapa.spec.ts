import { TestBed } from '@angular/core/testing';
import { Mapa } from './mapa';

describe('Mapa', () => {
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
