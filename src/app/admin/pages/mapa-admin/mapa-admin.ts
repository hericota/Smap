import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import * as L from 'leaflet';

interface OcorrenciaApi {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  latitude?: number | null;
  longitude?: number | null;
  criadaEm?: string | null;
}

type Nivel = 'alta' | 'media' | 'baixa';

interface RegiaoResumo {
  nome: string;
  total: number;
  nivel: Nivel;
}

@Component({
  selector: 'app-mapa-admin',
  standalone: true,
  imports: [],
  templateUrl: './mapa-admin.html',
  styleUrl: './mapa-admin.css',
})
export class MapaAdmin implements AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);

  private readonly apiBase = 'http://localhost:8080/ocorrencias';

  private readonly coresNivel: Record<Nivel, string> = {
    alta: '#e11d48',
    media: '#f59e0b',
    baixa: '#10b981',
  };

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;
  private registros = L.layerGroup();

  protected readonly ocorrencias = signal<OcorrenciaApi[]>([]);
  protected readonly carregando = signal(true);
  protected readonly comErro = signal(false);
  protected readonly selecionadaId = signal<number | null>(null);

  protected readonly comCoordenadas = computed(() =>
    this.ocorrencias().filter(
      (o) =>
        typeof o.latitude === 'number' &&
        typeof o.longitude === 'number' &&
        Number.isFinite(o.latitude) &&
        Number.isFinite(o.longitude),
    ),
  );

  protected readonly semCoordenadas = computed(
    () => this.ocorrencias().length - this.comCoordenadas().length,
  );

  protected readonly regioesResumo = computed<RegiaoResumo[]>(() => {
    const contagem = new Map<string, number>();

    for (const o of this.comCoordenadas()) {
      const nome = this.regiaoDe(o.localizacao);
      contagem.set(nome, (contagem.get(nome) ?? 0) + 1);
    }

    const ordenadas = [...contagem.entries()].sort((a, b) => b[1] - a[1]);
    const terco = Math.ceil(ordenadas.length / 3);

    return ordenadas.map(([nome, total], indice) => ({
      nome,
      total,
      nivel: (indice < terco ? 'alta' : indice < terco * 2 ? 'media' : 'baixa') as Nivel,
    }));
  });

  protected readonly contagemNiveis = computed(() => {
    const contagem: Record<Nivel, number> = { alta: 0, media: 0, baixa: 0 };
    for (const regiao of this.regioesResumo()) {
      contagem[regiao.nivel] += 1;
    }
    return contagem;
  });

  protected readonly recentes = computed(() =>
    [...this.ocorrencias()]
      .sort((a, b) => (b.criadaEm ?? '').localeCompare(a.criadaEm ?? ''))
      .slice(0, 5),
  );

  constructor() {
    this.carregar();
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([-26.92, -49.07], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.registros.addTo(this.map);
    this.renderizar();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
      this.resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  protected regiaoDe(localizacao: string): string {
    const partes = (localizacao ?? '').split('-');
    const bruta = partes.length > 1 ? partes[partes.length - 1] : (localizacao ?? '');
    return bruta.trim() || 'Sem região';
  }

  protected diasAtras(valor?: string | null): string {
    if (!valor) {
      return 'sem data';
    }
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return 'sem data';
    }
    const dias = Math.floor((Date.now() - data.getTime()) / 86_400_000);
    return dias === 0 ? 'hoje' : `${dias} dia${dias === 1 ? '' : 's'}`;
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.comErro.set(false);

    this.http.get<OcorrenciaApi[]>(this.apiBase).subscribe({
      next: (dados) => {
        this.ocorrencias.set(dados);
        this.carregando.set(false);
        this.renderizar();
      },
      error: () => {
        this.carregando.set(false);
        this.comErro.set(true);
      },
    });
  }

  protected focar(ocorrencia: OcorrenciaApi): void {
    if (typeof ocorrencia.latitude !== 'number' || typeof ocorrencia.longitude !== 'number') {
      return;
    }

    this.selecionadaId.set(ocorrencia.id);
    this.map?.setView([ocorrencia.latitude, ocorrencia.longitude], 16);
  }

  private renderizar(): void {
    this.registros.clearLayers();

    const niveis = new Map(this.regioesResumo().map((r) => [r.nome, r.nivel]));

    for (const ocorrencia of this.comCoordenadas()) {
      const popup = document.createElement('div');

      const titulo = document.createElement('strong');
      titulo.textContent = `#${ocorrencia.id} ${ocorrencia.titulo}`;

      const meta = document.createElement('p');
      meta.textContent = `${ocorrencia.categoria} — ${ocorrencia.localizacao}`;

      const descricao = document.createElement('p');
      descricao.textContent = ocorrencia.descricao;

      popup.append(titulo, meta, descricao);

      const nivel = niveis.get(this.regiaoDe(ocorrencia.localizacao)) ?? ('baixa' as Nivel);

      const marcador = L.circleMarker(
        [ocorrencia.latitude as number, ocorrencia.longitude as number],
        {
          radius: 9,
          color: this.coresNivel[nivel],
          fillOpacity: 0.7,
          bubblingMouseEvents: false,
        },
      )
        .bindPopup(popup)
        .addTo(this.registros);

      marcador.on('click', () => this.selecionadaId.set(ocorrencia.id));
    }

    if (this.comCoordenadas().length > 0) {
      this.map?.fitBounds(
        this.comCoordenadas().map(
          (o) => [o.latitude as number, o.longitude as number] as L.LatLngTuple,
        ),
        { maxZoom: 16, padding: [24, 24] },
      );
    }
  }
}