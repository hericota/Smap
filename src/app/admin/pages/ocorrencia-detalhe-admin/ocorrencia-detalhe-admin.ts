import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import * as L from 'leaflet';
import { environment } from '../../../../environments/environment';

interface OcorrenciaApi {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  latitude: number | null;
  longitude: number | null;
  criadaEm: string | null;
}

@Component({
  selector: 'app-ocorrencia-detalhes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ocorrencia-detalhe-admin.html',
  styleUrl: './ocorrencia-detalhe-admin.css',
})
export class OcorrenciaDetalhes implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly idOcorrencia = Number(this.route.snapshot.paramMap.get('id'));
  private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias/${this.idOcorrencia}`;

  protected readonly ocorrenciaResource = httpResource<OcorrenciaApi>(
    () => this.urlApi,
  );

  protected readonly ocorrencia = computed(() => this.ocorrenciaResource.value());

  protected readonly protocolo = computed(() =>
    this.ocorrencia()
      ? `SMAP-${this.anoProtocolo()}-${String(this.idOcorrencia).padStart(6, '0')}`
      : '',
  );

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private marcador?: L.Marker;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      this.aplicarMarcador(this.ocorrencia());
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.aplicarMarcador(this.ocorrencia());

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
      this.resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  protected formatadoEnviado(): string {
    const ocorrencia = this.ocorrencia();

    if (!ocorrencia?.criadaEm) {
      return '—';
    }

    const data = new Date(ocorrencia.criadaEm);

    if (Number.isNaN(data.getTime())) {
      return '—';
    }

    const mes = data
      .toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '');
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const horas = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${data.getDate()} ${mesCapitalizado}, ${horas}`;
  }

  private aplicarMarcador(ocorrencia: OcorrenciaApi | undefined | null): void {
    if (!this.map || !ocorrencia) {
      return;
    }

    const temCoordenadas =
      ocorrencia.latitude != null && ocorrencia.longitude != null;

    const coordenadas: L.LatLngTuple = temCoordenadas
      ? [ocorrencia.latitude!, ocorrencia.longitude!]
      : [-26.9184, -49.0656];

    if (this.marcador) {
      this.marcador.remove();
      this.marcador = undefined;
    }

    if (temCoordenadas) {
      this.marcador = L.marker(coordenadas, {
        icon: L.divIcon({
          className: 'pin-ocorrencia',
          html: `<svg viewBox="0 0 24 32" width="36" height="48" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#ef4444"/><circle cx="12" cy="12" r="4.5" fill="#ffffff"/></svg>`,
          iconSize: [36, 48],
          iconAnchor: [18, 46],
        }),
      }).addTo(this.map);
    }

    this.map.setView(coordenadas, temCoordenadas ? 15 : 12);
  }

  private anoProtocolo(): number {
    const criadaEm = this.ocorrencia()?.criadaEm;

    if (criadaEm) {
      const data = new Date(criadaEm);

      if (!Number.isNaN(data.getTime())) {
        return data.getFullYear();
      }
    }

    return new Date().getFullYear();
  }
}