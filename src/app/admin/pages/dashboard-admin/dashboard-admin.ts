import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import * as L from 'leaflet';
import { environment } from '../../../../environments/environment';

type TipoBadge = 'positivo' | 'critico' | 'eficiencia';

interface Indicador {
  label: string;
  valor: string;
  badge: string;
  tipo: TipoBadge;
}

interface StatusOcorrencia {
  nome: string;
  quantidade: number;
  percentual: number;
  classe: string;
}

interface RegiaoCritica {
  nome: string;
  total: number;
  altaPrioridade: number;
  tempoMedioDias: number;
}

interface AtencaoImediata {
  tipo: string;
  classe: string;
  endereco: string;
  diasAguardando: number;
}

interface OcorrenciaApi {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  latitude: number | null;
  longitude: number | null;
  criadaEm: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements AfterViewInit, OnDestroy {
  private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

  protected readonly ocorrenciasResource = httpResource<OcorrenciaApi[]>(
    () => this.urlApi,
    { defaultValue: [] },
  );

  protected readonly indicadores = computed<Indicador[]>(() => {
    const total = this.ocorrenciasResource.value().length;

    return [
      {
        label: 'Total Ocorrências',
        valor: total.toLocaleString('pt-BR'),
        badge: '↗ +12%',
        tipo: 'positivo',
      },
      {
        label: 'Alta Prioridade',
        valor: '23',
        badge: 'Crítica',
        tipo: 'critico',
      },
      {
        label: 'Resolvidas Este Mês',
        valor: '156',
        badge: 'Eficiência',
        tipo: 'eficiencia',
      },
    ];
  });

  protected readonly ocorrenciasPorStatus: StatusOcorrencia[] = [
    {
      nome: 'Enviada',
      quantidade: 184,
      percentual: 38,
      classe: 'status-enviada',
    },
    {
      nome: 'Em análise',
      quantidade: 245,
      percentual: 51,
      classe: 'status-analise',
    },
    {
      nome: 'Encaminhada',
      quantidade: 192,
      percentual: 40,
      classe: 'status-encaminhada',
    },
    {
      nome: 'Concluída',
      quantidade: 482,
      percentual: 100,
      classe: 'status-concluida',
    },
    {
      nome: 'Pausada',
      quantidade: 32,
      percentual: 7,
      classe: 'status-pausada',
    },
    {
      nome: 'Rejeitada',
      quantidade: 23,
      percentual: 5,
      classe: 'status-rejeitada',
    },
  ];

  protected readonly regioesCriticas: RegiaoCritica[] = [
    {
      nome: 'Centro Histórico',
      total: 423,
      altaPrioridade: 14,
      tempoMedioDias: 2.4,
    },
    {
      nome: 'Vila Nova',
      total: 289,
      altaPrioridade: 5,
      tempoMedioDias: 4.1,
    },
    {
      nome: 'Itoupava Norte',
      total: 212,
      altaPrioridade: 2,
      tempoMedioDias: 3.2,
    },
    {
      nome: 'Escola Agrícola',
      total: 178,
      altaPrioridade: 1,
      tempoMedioDias: 5.0,
    },
    {
      nome: 'Garcia',
      total: 145,
      altaPrioridade: 1,
      tempoMedioDias: 4.5,
    },
  ];

  protected readonly atencaoImediata: AtencaoImediata[] = [
    {
      tipo: 'Buraco',
      classe: 'atencao-buraco',
      endereco: 'Rua XV de Novembro, Centro',
      diasAguardando: 20,
    },
    {
      tipo: "Vazamento d'água",
      classe: 'atencao-vazamento',
      endereco: 'Av. Brasil, Ponta Aguda',
      diasAguardando: 27,
    },
    {
      tipo: 'Poste Apagado',
      classe: 'atencao-poste',
      endereco: 'Rua Joinville, Vila Nova',
      diasAguardando: 30,
    },
  ];

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private zonasLayer?: L.LayerGroup;
  private resizeObserver?: ResizeObserver;

  private readonly coresIntensidade: Record<string, string> = {
    alta: '#f5484c',
    media: '#d97706',
    baixa: '#13b1a2',
  };

  private readonly zonasProvisorias = [
    {
      nome: 'Centro',
      coordenadas: [-26.9184, -49.0656] as L.LatLngTuple,
      raio: 700,
      quantidade: 38,
      intensidade: 'alta',
    },
    {
      nome: 'Itoupava Norte',
      coordenadas: [-26.8894, -49.0794] as L.LatLngTuple,
      raio: 800,
      quantidade: 21,
      intensidade: 'media',
    },
    {
      nome: 'Velha',
      coordenadas: [-26.9403, -49.0786] as L.LatLngTuple,
      raio: 700,
      quantidade: 17,
      intensidade: 'media',
    },
    {
      nome: 'Garcia',
      coordenadas: [-26.9283, -49.0453] as L.LatLngTuple,
      raio: 600,
      quantidade: 9,
      intensidade: 'baixa',
    },
  ];

  constructor() {
    effect(() => {
      this.montarZonas(this.ocorrenciasResource.value());
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.zonasLayer = L.layerGroup().addTo(this.map);

    this.map.setView([-26.9184, -49.0656], 12);

    this.montarZonas(this.ocorrenciasResource.value());

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
      this.resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private montarZonas(ocorrencias: OcorrenciaApi[]): void {
    if (!this.map || !this.zonasLayer) {
      return;
    }

    this.zonasLayer.clearLayers();

    const comCoordenadas = ocorrencias.filter(
      (ocorrencia) => ocorrencia.latitude != null && ocorrencia.longitude != null,
    );

    if (comCoordenadas.length === 0) {
      this.montarZonasProvisorias();
      return;
    }

    const grupos = new Map<
      string,
      { coordenadas: L.LatLngTuple; quantidade: number }
    >();

    for (const ocorrencia of comCoordenadas) {
      const chave = `${ocorrencia.latitude!.toFixed(2)}|${ocorrencia.longitude!.toFixed(2)}`;
      const coordenadas: L.LatLngTuple = [
        ocorrencia.latitude!,
        ocorrencia.longitude!,
      ];

      const grupo = grupos.get(chave);

      if (grupo) {
        grupo.quantidade += 1;
      } else {
        grupos.set(chave, { coordenadas, quantidade: 1 });
      }
    }

    const zonas = [...grupos.values()];
    const maximo = Math.max(...zonas.map((zona) => zona.quantidade));

    for (const zona of zonas) {
      const razao = zona.quantidade / maximo;
      const intensidade =
        razao > 2 / 3 ? 'alta' : razao > 1 / 3 ? 'media' : 'baixa';
      const cor = this.coresIntensidade[intensidade];

      L.circle(zona.coordenadas, {
        radius: 300 + 300 * razao,
        color: cor,
        weight: 1,
        fillColor: cor,
        fillOpacity: 0.4,
      })
        .bindTooltip(
          `${zona.quantidade} ocorrência${zona.quantidade > 1 ? 's' : ''}`,
        )
        .addTo(this.zonasLayer);
    }

    if (zonas.length === 1) {
      this.map.setView(zonas[0].coordenadas, 13);
    } else {
      this.map.fitBounds(
        zonas.map((zona) => zona.coordenadas),
        { padding: [24, 24] },
      );
    }
  }

  private montarZonasProvisorias(): void {
    if (!this.map || !this.zonasLayer) {
      return;
    }

    for (const zona of this.zonasProvisorias) {
      const cor = this.coresIntensidade[zona.intensidade];

      L.circle(zona.coordenadas, {
        radius: zona.raio,
        color: cor,
        weight: 1,
        fillColor: cor,
        fillOpacity: 0.4,
      })
        .bindTooltip(`${zona.nome}: ${zona.quantidade} ocorrências`)
        .addTo(this.zonasLayer);
    }

    this.map.fitBounds(
      this.zonasProvisorias.map((zona) => zona.coordenadas),
      { padding: [24, 24] },
    );
  }
}