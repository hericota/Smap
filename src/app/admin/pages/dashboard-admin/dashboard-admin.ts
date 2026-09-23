import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

type TipoBadge = 'positivo' | 'critico' | 'eficiencia';
type CategoriaBadge = 'buraco' | 'vazamento' | 'poste';

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
  regiao: string;
  total: number;
  altaPrioridade: number;
  tempoMedio: string;
}

interface OcorrenciaAntiga {
  tipo: string;
  categoria: CategoriaBadge;
  endereco: string;
  diasAguardando: number;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements AfterViewInit, OnDestroy {
  protected readonly indicadores: Indicador[] = [
    {
      label: 'Total Ocorrências',
      valor: '1.247',
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
      regiao: 'Centro Histórico',
      total: 423,
      altaPrioridade: 14,
      tempoMedio: '2.4 dias',
    },
    {
      regiao: 'Vila Nova',
      total: 289,
      altaPrioridade: 5,
      tempoMedio: '4.1 dias',
    },
    {
      regiao: 'Itoupava Norte',
      total: 212,
      altaPrioridade: 2,
      tempoMedio: '3.2 dias',
    },
    {
      regiao: 'Escola Agrícola',
      total: 178,
      altaPrioridade: 1,
      tempoMedio: '5.0 dias',
    },
    {
      regiao: 'Garcia',
      total: 145,
      altaPrioridade: 1,
      tempoMedio: '4.5 dias',
    },
  ];

  protected readonly atencaoImediata: OcorrenciaAntiga[] = [
    {
      tipo: 'Buraco',
      categoria: 'buraco',
      endereco: 'Rua XV de Novembro, Centro',
      diasAguardando: 20,
    },
    {
      tipo: "Vazamento d'água",
      categoria: 'vazamento',
      endereco: 'Av. Brasil, Ponta Aguda',
      diasAguardando: 27,
    },
    {
      tipo: 'Poste Apagado',
      categoria: 'poste',
      endereco: 'Rua Joinville, Vila Nova',
      diasAguardando: 30,
    },
  ];

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;

  private readonly coresIntensidade: Record<string, string> = {
    alta: '#d64545',
    media: '#f2a13c',
    baixa: '#13c4a3',
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

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.montarZonas();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
      this.resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private montarZonas(): void {
    if (!this.map) {
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
        .addTo(this.map);
    }

    this.map.fitBounds(
      this.zonasProvisorias.map((zona) => zona.coordenadas),
      { padding: [24, 24] },
    );
  }
}