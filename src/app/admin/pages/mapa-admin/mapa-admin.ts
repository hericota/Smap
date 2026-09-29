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
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Ocorrencia, StatusOcorrencia } from '../../../feats/ocorrencia';
import * as L from 'leaflet';

type OcorrenciaApi = Ocorrencia & { id: number };

interface CategoriaLegenda {
  nome: string;
  cor: string;
  icone: string;
}

@Component({
  selector: 'app-mapa-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mapa-admin.html',
  styleUrl: './mapa-admin.css',
})
export class MapaAdmin implements AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;
  private registros = L.layerGroup();

  // ===== ESTADO =====
  protected readonly ocorrencias = signal<OcorrenciaApi[]>([]);
  protected readonly carregando = signal(true);
  protected readonly comErro = signal(false);
  protected readonly selecionadaId = signal<number | null>(null);

  // ===== FILTROS =====
  protected readonly filtroBusca = signal('');
  protected readonly filtroPrioridade = signal('');
  protected readonly filtroStatus = signal('');
  protected readonly filtroCategoria = signal('');

  // ===== CORES POR CATEGORIA (extraídas do Print 1) =====
  protected readonly categoriasLegenda: CategoriaLegenda[] = [
    { nome: 'Buraco', cor: '#8B5E3C', icone: '🕳️' },
    { nome: 'Iluminação', cor: '#F59E0B', icone: '💡' },
    { nome: 'Sinalização', cor: '#EF4444', icone: '🚦' },
    { nome: 'Saneamento', cor: '#3B82F6', icone: '💧' },
  ];

  private readonly coresCategoria: Record<string, string> = {
    buraco: '#8B5E3C',
    asfalto: '#8B5E3C',
    iluminacao: '#F59E0B',
    iluminação: '#F59E0B',
    sinalizacao: '#EF4444',
    sinalização: '#EF4444',
    saneamento: '#3B82F6',
    esgoto: '#3B82F6',
    vazamento: '#3B82F6',
    lixo: '#7C8B3A',
    entulho: '#F97316',
    arvore: '#10B981',
    árvore: '#10B981',
    acessibilidade: '#8B5CF6',
  };

  // ===== COMPUTED =====
  protected readonly comCoordenadas = computed(() =>
    this.ocorrencias().filter(
      (o) =>
        typeof o.latitude === 'number' &&
        typeof o.longitude === 'number' &&
        Number.isFinite(o.latitude) &&
        Number.isFinite(o.longitude),
    ),
  );

  protected readonly ocorrenciasFiltradas = computed(() => {
    let lista = this.comCoordenadas();

    const busca = this.filtroBusca().toLowerCase().trim();
    if (busca) {
      lista = lista.filter(
        (o) =>
          o.titulo.toLowerCase().includes(busca) ||
          o.descricao.toLowerCase().includes(busca) ||
          o.localizacao.toLowerCase().includes(busca),
      );
    }

    if (this.filtroStatus()) {
      lista = lista.filter((o) => (o.status ?? 'PENDENTE') === this.filtroStatus());
    }

    if (this.filtroCategoria()) {
      lista = lista.filter((o) =>
        o.categoria?.toLowerCase().includes(this.filtroCategoria().toLowerCase()),
      );
    }

    return lista;
  });

  protected readonly semCoordenadas = computed(
    () => this.ocorrencias().length - this.comCoordenadas().length,
  );

  protected readonly recentes = computed(() =>
    [...this.ocorrenciasFiltradas()]
      .sort((a, b) => (b.criadaEm ?? '').localeCompare(a.criadaEm ?? ''))
      .slice(0, 5),
  );

  protected readonly statusResumo = computed(() => {
    const lista = this.ocorrenciasFiltradas();
    return {
      total: lista.length,
      pendentes: lista.filter((o) => (o.status ?? 'PENDENTE') === 'PENDENTE').length,
      emExecucao: lista.filter((o) => o.status === 'EM_ANDAMENTO').length,
      concluidos: lista.filter((o) => o.status === 'RESOLVIDA').length,
    };
  });

  // Região exibida no painel direito
  protected readonly regiaoAtual = computed(() => {
    // Por enquanto fixo; depois pode ser calculado por bounding box
    return 'Região Centro';
  });

  constructor() {
    this.carregar();
  }

  // ===== LIFECYCLE =====
  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false, // vamos reposicionar
      attributionControl: false,
    }).setView([-26.92, -49.07], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
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

  // ===== HELPERS =====
  protected corDaCategoria(categoria: string): string {
    const chave = Object.keys(this.coresCategoria).find((k) =>
      categoria?.toLowerCase().includes(k),
    );
    return chave ? this.coresCategoria[chave] : '#6B7280';
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

  protected limparFiltros(): void {
    this.filtroBusca.set('');
    this.filtroPrioridade.set('');
    this.filtroStatus.set('');
    this.filtroCategoria.set('');
    this.renderizar();
  }

  protected alternarFullscreen(): void {
    const el = document.querySelector('.mapa-wrapper');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  protected recarregarMapa(): void {
    this.renderizar();
  }

  // ===== RENDERIZAÇÃO =====
  private renderizar(): void {
    this.registros.clearLayers();

    for (const ocorrencia of this.ocorrenciasFiltradas()) {
      const cor = this.corDaCategoria(ocorrencia.categoria);

      const popup = document.createElement('div');
      popup.className = 'popup-ocorrencia';
      popup.innerHTML = `
        <strong>#${ocorrencia.id} ${ocorrencia.titulo}</strong>
        <p>${ocorrencia.categoria} — ${ocorrencia.localizacao}</p>
        <p>${ocorrencia.descricao}</p>
      `;

      const marcador = L.circleMarker(
        [ocorrencia.latitude as number, ocorrencia.longitude as number],
        {
          radius: 10,
          color: cor,
          fillColor: cor,
          fillOpacity: 0.9,
          weight: 2,
          bubblingMouseEvents: false,
        },
      )
        .bindPopup(popup)
        .addTo(this.registros);

      marcador.on('click', () => this.selecionadaId.set(ocorrencia.id));
    }

    if (this.ocorrenciasFiltradas().length > 0) {
      this.map?.fitBounds(
        this.ocorrenciasFiltradas().map(
          (o) => [o.latitude as number, o.longitude as number] as L.LatLngTuple,
        ),
        { maxZoom: 15, padding: [60, 60] },
      );
    }
  }
}