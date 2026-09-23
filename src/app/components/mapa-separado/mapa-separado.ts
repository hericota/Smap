import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule, NgForm } from '@angular/forms';
import { Header } from '../../component/header/header';
import { BottomNav } from '../bottom-nav/bottom-nav';
interface Ocorrencia {
  id: string;
  categoria: string;
  descricao: string;
  latitude: number;
  longitude: number;
  criadaEm: string;
}
const STORAGE_KEY = 'smap.ocorrencias.v1';

@Component({
  imports: [FormsModule],
  selector: 'app-mapa-separado',
  styleUrl: './mapa-separado.css',
  templateUrl: './mapa-separado.html',
})

export class MapaSeparado implements AfterViewInit, OnDestroy{
  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  protected readonly tileError = signal(false);
  readonly categorias = ['Vias públicas', 'Iluminação', 'Lixo e limpeza', 'Alagamento', 'Sinalização', 'Acessibilidade', 'Outros'];
  categoria = '';
  descricao = '';
  readonly ponto = signal<{ latitude: number; longitude: number; precisao?: number } | null>(null);
  readonly localizando = signal(false);
  readonly mensagem = signal('');
  readonly erro = signal('');
  readonly ocorrencias = signal<Ocorrencia[]>([]);
  private selecao?: L.CircleMarker;
  private registros = L.layerGroup();
  private requestId = 0;
  private destroyed = false;
  private storageReady = true;
  private map?: L.Map;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    // Localização só é solicitada quando o usuário toca no botão.
    this.map = L.map(this.mapContainer.nativeElement).setView([-14.235, -51.9253], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
      .on('tileerror', () => this.tileError.set(true))
      .addTo(this.map);
    this.registros.addTo(this.map);
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.requestId++;
      this.localizando.set(false);
    });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
      this.resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.requestId++;
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }
}
