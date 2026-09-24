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
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as L from 'leaflet';

type StatusOcorrencia =
  | 'Enviada'
  | 'Em análise'
  | 'Encaminhada'
  | 'Concluída'
  | 'Pausada'
  | 'Rejeitada';

type Prioridade = 'Alta' | 'Média' | 'Baixa';

interface RegistroHistorico {
  titulo: string;
  descricao: string;
  autor: string;
  momento: string;
  statusDaEpoca: StatusOcorrencia;
}

interface Transicao {
  novoStatus: StatusOcorrencia;
  rotuloBotao: string;
  tituloHistorico: string;
  descricaoHistorico: string;
  fraseModal: string;
}

@Component({
  imports: [RouterLink],
  selector: 'app-ocorrencia-detalhe-admin',
  styleUrl: './ocorrencia-detalhe-admin.css',
  templateUrl: './ocorrencia-detalhe-admin.html',
})
export class OcorrenciaDetalheAdmin implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);

  protected readonly codigo =
    this.route.snapshot.paramMap.get('codigo') ?? 'SMAP-2026-001245';

  protected readonly status = signal<StatusOcorrencia>('Em análise');
  protected readonly prioridade: Prioridade = 'Alta';
  protected readonly secretaria = 'SEINFRA';

  protected readonly fotoAtiva = signal(0);
  protected readonly indicesFotos = [0, 1, 2];

  protected readonly modalAberto = signal(false);
  protected readonly modalMensagem = signal('');

  protected readonly historico = signal<RegistroHistorico[]>([
    {
      titulo: 'Em análise',
      descricao:
        'Registro em verificação e classificação pela equipe administrativa.',
      autor: 'Carlos Silva (SEINFRA)',
      momento: '28 jan 2026, 11:02',
      statusDaEpoca: 'Em análise',
    },
    {
      titulo: 'Recebida pelo sistema',
      descricao:
        'Registro criado e aceito pelo sistema. Protocolo gerado e cidadã notificada.',
      autor: 'Sistema Automático',
      momento: '28 jan 2026, 10:45',
      statusDaEpoca: 'Enviada',
    },
  ]);

  private readonly transicoesPrimarias: Record<StatusOcorrencia, Transicao | null> = {
    'Enviada': {
      novoStatus: 'Em análise',
      rotuloBotao: 'Iniciar análise',
      tituloHistorico: 'Em análise',
      descricaoHistorico:
        'Triagem iniciada pelo operador administrativo.',
      fraseModal: 'movida para "Em análise"',
    },
    'Em análise': {
      novoStatus: 'Encaminhada',
      rotuloBotao: 'Encaminhar para execução',
      tituloHistorico: 'Encaminhada para execução',
      descricaoHistorico:
        'Ocorrência encaminhada ao setor responsável (SEINFRA).',
      fraseModal: 'encaminhada para execução',
    },
    'Encaminhada': {
      novoStatus: 'Concluída',
      rotuloBotao: 'Marcar como concluída',
      tituloHistorico: 'Ocorrência concluída',
      descricaoHistorico:
        'Problema tratado e finalizado pelo setor responsável.',
      fraseModal: 'marcada como concluída',
    },
    'Pausada': {
      novoStatus: 'Em análise',
      rotuloBotao: 'Retomar análise',
      tituloHistorico: 'Análise retomada',
      descricaoHistorico:
        'Ocorrência retornou para a fila de análise administrativa.',
      fraseModal: 'retornada para análise',
    },
    'Concluída': null,
    'Rejeitada': null,
  };

  protected readonly acaoPrimariaLabel = computed(() => {
    const transicao = this.transicoesPrimarias[this.status()];

    return transicao ? transicao.rotuloBotao : null;
  });

  protected readonly pausarVisivel = computed(() =>
    ['Enviada', 'Em análise', 'Encaminhada'].includes(this.status()),
  );

  protected readonly rejeitarVisivel = computed(() =>
    ['Enviada', 'Em análise', 'Encaminhada', 'Pausada'].includes(this.status()),
  );

  @ViewChild('mapaContainer', { static: true })
  private mapaContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    const container = this.mapaContainer.nativeElement;

    const map = L.map(container, {
      center: [-26.9155, -49.0709],
      zoom: 16,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const icone = L.divIcon({
      className: 'pino-ocorrencia',
      html: `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5z" fill="#f5484c" stroke="#ffffff" stroke-width="1"/></svg>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    L.marker([-26.9155, -49.0709], { icon: icone }).addTo(map);

    this.resizeObserver = new ResizeObserver(() => map.invalidateSize());
    this.resizeObserver.observe(container);

    this.map = map;
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  protected selecionarFoto(indice: number): void {
    this.fotoAtiva.set(indice);
  }

  protected executarAcaoPrimaria(): void {
    const transicao = this.transicoesPrimarias[this.status()];

    if (!transicao) {
      return;
    }

    this.registrarMudanca(transicao);
  }

  protected pausar(): void {
    this.registrarMudanca({
      novoStatus: 'Pausada',
      tituloHistorico: 'Ocorrência pausada',
      descricaoHistorico: 'Atendimento pausado temporariamente pelo operador.',
      fraseModal: 'pausada',
    });
  }

  protected rejeitar(): void {
    this.registrarMudanca({
      novoStatus: 'Rejeitada',
      tituloHistorico: 'Ocorrência rejeitada',
      descricaoHistorico:
        'Registro não atende aos critérios definidos para atendimento.',
      fraseModal: 'rejeitada',
    });
  }

  protected fecharModal(): void {
    this.modalAberto.set(false);
  }

  private registrarMudanca(transicao: Omit<Transicao, 'rotuloBotao'>): void {
    const momento = this.momentoAgora();

    this.status.set(transicao.novoStatus);

    this.historico.update((registros) => [
      {
        titulo: transicao.tituloHistorico,
        descricao: transicao.descricaoHistorico,
        autor: 'Carlos Silva (SEINFRA)',
        momento,
        statusDaEpoca: transicao.novoStatus,
      },
      ...registros,
    ]);

    this.modalMensagem.set(
      `A ocorrência ${this.codigo} foi ${transicao.fraseModal}. O cidadão será notificado.`,
    );
    this.modalAberto.set(true);
  }

  protected classeStatus(status: StatusOcorrencia): string {
    const mapa: Record<StatusOcorrencia, string> = {
      'Enviada': 'chip-enviada',
      'Em análise': 'chip-analise',
      'Encaminhada': 'chip-encaminhada',
      'Concluída': 'chip-concluida',
      'Pausada': 'chip-pausada',
      'Rejeitada': 'chip-rejeitada',
    };

    return mapa[status];
  }

  protected classePrioridade(prioridade: Prioridade): string {
    const mapa: Record<Prioridade, string> = {
      'Alta': 'ponto-alta',
      'Média': 'ponto-media',
      'Baixa': 'ponto-baixa',
    };

    return mapa[prioridade];
  }

  private momentoAgora(): string {
    const agora = new Date();
    const meses = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez',
    ];
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');

    return `${agora.getDate()} ${meses[agora.getMonth()]} ${agora.getFullYear()}, ${hora}:${minuto}`;
  }
}