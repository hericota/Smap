import {
  Component,
  computed,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';

type Prioridade = 'Alta' | 'Média' | 'Baixa';
type StatusOcorrencia =
  | 'Enviada'
  | 'Em análise'
  | 'Encaminhada'
  | 'Concluída'
  | 'Pausada'
  | 'Rejeitada';
type ChaveFiltro = 'prioridade' | 'status' | 'categoria' | 'regiao' | 'periodo';

interface OcorrenciaProvisoria {
  codigo: string;
  categoria: string;
  endereco: string;
  regiao: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusOcorrencia;
  diasAguardando: number;
}

interface FiltroAtivo {
  chave: ChaveFiltro;
  rotulo: string;
}

@Component({
  imports: [],
  selector: 'app-ocorrencias-admin',
  styleUrl: './ocorrencias-admin.css',
  templateUrl: './ocorrencias-admin.html',
})
export class OcorrenciasAdmin {
  private readonly router = inject(Router);

  private readonly tamanhoPagina = 8;

  protected readonly busca = signal('');
  protected readonly filtroPrioridade = signal('');
  protected readonly filtroStatus = signal('');
  protected readonly filtroCategoria = signal('');
  protected readonly filtroRegiao = signal('');
  protected readonly filtroPeriodo = signal('');
  protected readonly paginaAtual = signal(1);

  protected readonly ocorrencias: OcorrenciaProvisoria[] = [
    {
      codigo: 'SMAP-2026-001245',
      categoria: 'Buraco',
      endereco: 'Rua XV de Novembro, 1420 - Centro',
      regiao: 'Centro',
      descricao: 'Buraco na pista próximo ao número 1420.',
      prioridade: 'Alta',
      status: 'Enviada',
      diasAguardando: 9,
    },
    {
      codigo: 'SMAP-2026-001246',
      categoria: 'Iluminação',
      endereco: 'Av. Beira Rio, 450 - Centro',
      regiao: 'Centro',
      descricao: 'Poste apagado em frente ao número 450.',
      prioridade: 'Média',
      status: 'Em análise',
      diasAguardando: 3,
    },
    {
      codigo: 'SMAP-2026-001247',
      categoria: 'Sinalização',
      endereco: 'Rua Joinville, 89 - Vila Nova',
      regiao: 'Vila Nova',
      descricao: 'Placa de sinalização danificada.',
      prioridade: 'Alta',
      status: 'Encaminhada',
      diasAguardando: 8,
    },
    {
      codigo: 'SMAP-2026-001248',
      categoria: 'Calçada',
      endereco: 'Rua Corupós, 56 - Escola Agrícola',
      regiao: 'Escola Agrícola',
      descricao: 'Calçada irregular em frente à escola.',
      prioridade: 'Média',
      status: 'Concluída',
      diasAguardando: 0,
    },
    {
      codigo: 'SMAP-2026-001250',
      categoria: 'Árvore Caída',
      endereco: 'Av. Brasil, 980 - Ponta Aguda',
      regiao: 'Ponta Aguda',
      descricao: 'Árvore caída sobre a via após temporal.',
      prioridade: 'Alta',
      status: 'Concluída',
      diasAguardando: 0,
    },
    {
      codigo: 'SMAP-2026-001251',
      categoria: 'Entulho',
      endereco: 'Rua Alvin Schrader, 230 - Centro',
      regiao: 'Centro',
      descricao: 'Entulho acumulado na calçada.',
      prioridade: 'Baixa',
      status: 'Pausada',
      diasAguardando: 12,
    },
    {
      codigo: 'SMAP-2026-001252',
      categoria: 'Boca de Lobo',
      endereco: 'Rua Benjamin Constant, 45 - Escola Agrícola',
      regiao: 'Escola Agrícola',
      descricao: 'Boca de lobo sem tampa de proteção.',
      prioridade: 'Alta',
      status: 'Rejeitada',
      diasAguardando: 15,
    },
  ];

  protected readonly statusDisponiveis: StatusOcorrencia[] = [
    'Enviada',
    'Em análise',
    'Encaminhada',
    'Concluída',
    'Pausada',
    'Rejeitada',
  ];

  protected readonly categoriasDisponiveis: string[] = [
    ...new Set(this.ocorrencias.map((ocorrencia) => ocorrencia.categoria)),
  ];

  protected readonly regioesDisponiveis: string[] = [
    ...new Set(this.ocorrencias.map((ocorrencia) => ocorrencia.regiao)),
  ];

  protected readonly ocorrenciasFiltradas = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const prioridade = this.filtroPrioridade();
    const status = this.filtroStatus();
    const categoria = this.filtroCategoria();
    const regiao = this.filtroRegiao();
    const periodo = this.filtroPeriodo();

    return this.ocorrencias.filter((ocorrencia) => {
      if (termo) {
        const conteudo =
          `${ocorrencia.codigo} ${ocorrencia.endereco} ${ocorrencia.descricao} ${ocorrencia.categoria}`.toLowerCase();

        if (!conteudo.includes(termo)) {
          return false;
        }
      }

      if (prioridade && ocorrencia.prioridade !== prioridade) {
        return false;
      }

      if (status && ocorrencia.status !== status) {
        return false;
      }

      if (categoria && ocorrencia.categoria !== categoria) {
        return false;
      }

      if (regiao && ocorrencia.regiao !== regiao) {
        return false;
      }

      if (periodo && ocorrencia.diasAguardando > Number(periodo)) {
        return false;
      }

      return true;
    });
  });

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.ocorrenciasFiltradas().length / this.tamanhoPagina)),
  );

  protected readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, indice) => indice + 1),
  );

  protected readonly ocorrenciasPaginadas = computed(() => {
    const fim = this.paginaAtual() * this.tamanhoPagina;
    const inicio = fim - this.tamanhoPagina;

    return this.ocorrenciasFiltradas().slice(inicio, fim);
  });

  protected readonly inicioFaixa = computed(() =>
    this.ocorrenciasFiltradas().length === 0
      ? 0
      : (this.paginaAtual() - 1) * this.tamanhoPagina + 1,
  );

  protected readonly fimFaixa = computed(() =>
    Math.min(this.paginaAtual() * this.tamanhoPagina, this.ocorrenciasFiltradas().length),
  );

  protected readonly filtrosAtivos = computed<FiltroAtivo[]>(() => {
    const ativos: FiltroAtivo[] = [];

    if (this.filtroPrioridade()) {
      ativos.push({ chave: 'prioridade', rotulo: `${this.filtroPrioridade()} Prioridade` });
    }

    if (this.filtroStatus()) {
      ativos.push({ chave: 'status', rotulo: `Status: ${this.filtroStatus()}` });
    }

    if (this.filtroCategoria()) {
      ativos.push({ chave: 'categoria', rotulo: `Categoria: ${this.filtroCategoria()}` });
    }

    if (this.filtroRegiao()) {
      ativos.push({ chave: 'regiao', rotulo: `Região: ${this.filtroRegiao()}` });
    }

    if (this.filtroPeriodo()) {
      ativos.push({
        chave: 'periodo',
        rotulo: `Período: ${this.rotuloPeriodo(this.filtroPeriodo())}`,
      });
    }

    return ativos;
  });

  constructor() {
    effect(() => {
      if (this.paginaAtual() > this.totalPaginas()) {
        this.paginaAtual.set(this.totalPaginas());
      }
    });
  }

  protected onBusca(evento: Event): void {
    this.busca.set((evento.target as HTMLInputElement).value);
    this.paginaAtual.set(1);
  }

  protected onFiltroPrioridade(evento: Event): void {
    this.filtroPrioridade.set((evento.target as HTMLSelectElement).value);
    this.paginaAtual.set(1);
  }

  protected onFiltroStatus(evento: Event): void {
    this.filtroStatus.set((evento.target as HTMLSelectElement).value);
    this.paginaAtual.set(1);
  }

  protected onFiltroCategoria(evento: Event): void {
    this.filtroCategoria.set((evento.target as HTMLSelectElement).value);
    this.paginaAtual.set(1);
  }

  protected onFiltroRegiao(evento: Event): void {
    this.filtroRegiao.set((evento.target as HTMLSelectElement).value);
    this.paginaAtual.set(1);
  }

  protected onFiltroPeriodo(evento: Event): void {
    this.filtroPeriodo.set((evento.target as HTMLSelectElement).value);
    this.paginaAtual.set(1);
  }

  protected limparFiltro(chave: ChaveFiltro): void {
    const filtros: Record<ChaveFiltro, WritableSignal<string>> = {
      prioridade: this.filtroPrioridade,
      status: this.filtroStatus,
      categoria: this.filtroCategoria,
      regiao: this.filtroRegiao,
      periodo: this.filtroPeriodo,
    };

    filtros[chave].set('');
    this.paginaAtual.set(1);
  }

  protected limparFiltros(): void {
    this.filtroPrioridade.set('');
    this.filtroStatus.set('');
    this.filtroCategoria.set('');
    this.filtroRegiao.set('');
    this.filtroPeriodo.set('');
    this.paginaAtual.set(1);
  }

  protected paginaAnterior(): void {
    this.paginaAtual.update((pagina) => Math.max(1, pagina - 1));
  }

  protected proximaPagina(): void {
    this.paginaAtual.update((pagina) => Math.min(this.totalPaginas(), pagina + 1));
  }

  protected selecionarPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  protected abrirDetalhe(codigo: string): void {
    this.router.navigate(['/admin/ocorrencias', codigo]);
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

  protected classeDias(dias: number): string {
    return dias >= 7 ? 'alerta' : '';
  }

  protected exportarCsv(): void {
    const cabecalho = [
      'Código',
      'Categoria',
      'Localização',
      'Prioridade',
      'Status',
      'Dias aguardando',
    ];

    const linhas = this.ocorrenciasFiltradas().map((ocorrencia) => [
      ocorrencia.codigo,
      ocorrencia.categoria,
      ocorrencia.endereco,
      ocorrencia.prioridade,
      ocorrencia.status,
      String(ocorrencia.diasAguardando),
    ]);

    const conteudo = [cabecalho, ...linhas]
      .map((linha) =>
        linha.map((valor) => `"${valor.replaceAll('"', '""')}"`).join(';'),
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${conteudo}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ocorrencias-smap.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  private rotuloPeriodo(valor: string): string {
    const mapa: Record<string, string> = {
      '7': 'Últimos 7 dias',
      '15': 'Últimos 15 dias',
      '30': 'Últimos 30 dias',
    };

    return mapa[valor] ?? '';
  }
}