import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
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

interface CategoriaOpcao {
  valor: string;
  rotulo: string;
}

@Component({
  selector: 'app-ocorrencias-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ocorrencias-admin.html',
  styleUrl: './ocorrencias-admin.css',
})
export class OcorrenciasAdmin {
  private readonly router = inject(Router);
  private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

  protected readonly ocorrenciasResource = httpResource<OcorrenciaApi[]>(
    () => this.urlApi,
    { defaultValue: [] },
  );

  protected readonly busca = signal('');
  protected readonly categoriaSelecionada = signal('todas');
  protected readonly pagina = signal(1);

  private readonly tamanhoPagina = 8;

  protected readonly totalRegistros = computed(() =>
    this.ocorrenciasResource.value().length,
  );

  protected readonly temRegistros = computed(() => this.totalRegistros() > 0);

  protected readonly categoriasDisponiveis = computed<CategoriaOpcao[]>(() => {
    const mapa = new Map<string, string>();

    for (const ocorrencia of this.ocorrenciasResource.value()) {
      const valor = this.normalizar(ocorrencia.categoria);

      if (valor && !mapa.has(valor)) {
        mapa.set(valor, ocorrencia.categoria);
      }
    }

    return [
      { valor: 'todas', rotulo: 'Categoria' },
      ...[...mapa.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
        .map(([valor, rotulo]) => ({ valor, rotulo })),
    ];
  });

  protected readonly ocorrenciasFiltradas = computed<OcorrenciaApi[]>(() => {
    const busca = this.normalizar(this.busca());
    const categoria = this.categoriaSelecionada();

    return this.ocorrenciasResource
      .value()
      .filter((ocorrencia) => {
        if (
          categoria !== 'todas' &&
          this.normalizar(ocorrencia.categoria) !== categoria
        ) {
          return false;
        }

        if (!busca) {
          return true;
        }

        return [
          this.formatarProtocolo(ocorrencia.id),
          ocorrencia.titulo,
          ocorrencia.descricao,
          ocorrencia.localizacao,
          ocorrencia.categoria,
        ].some((campo) => this.normalizar(campo).includes(busca));
      })
      .sort(
        (a, b) =>
          new Date(b.criadaEm ?? 0).getTime() - new Date(a.criadaEm ?? 0).getTime(),
      );
  });

  protected readonly totalFiltrados = computed(
    () => this.ocorrenciasFiltradas().length,
  );

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.totalFiltrados() / this.tamanhoPagina)),
  );

  protected readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, indice) => indice + 1),
  );

  protected readonly ocorrenciasPaginadas = computed(() => {
    const inicio = (this.pagina() - 1) * this.tamanhoPagina;

    return this.ocorrenciasFiltradas().slice(
      inicio,
      inicio + this.tamanhoPagina,
    );
  });

  protected readonly inicioContagem = computed(() =>
    this.totalFiltrados() === 0
      ? 0
      : (this.pagina() - 1) * this.tamanhoPagina + 1,
  );

  protected readonly fimContagem = computed(() =>
    Math.min(this.pagina() * this.tamanhoPagina, this.totalFiltrados()),
  );

  protected readonly temFiltrosAtivos = computed(
    () => this.busca().length > 0 || this.categoriaSelecionada() !== 'todas',
  );

  protected readonly rotuloCategoriaAtiva = computed(() => {
    const valor = this.categoriaSelecionada();
    const opcao = this.categoriasDisponiveis().find(
      (item) => item.valor === valor,
    );

    return opcao?.rotulo ?? valor;
  });

  protected aoDigitar(valor: string): void {
    this.busca.set(valor);
    this.pagina.set(1);
  }

  protected aoFiltrarCategoria(valor: string): void {
    this.categoriaSelecionada.set(valor);
    this.pagina.set(1);
  }

  protected limparBusca(): void {
    this.busca.set('');
    this.pagina.set(1);
  }

  protected limparCategoria(): void {
    this.categoriaSelecionada.set('todas');
    this.pagina.set(1);
  }

  protected limparFiltros(): void {
    this.limparBusca();
    this.limparCategoria();
  }

  protected paginar(numero: number): void {
    const alvo = Math.min(Math.max(1, numero), this.totalPaginas());

    this.pagina.set(alvo);
  }

  protected abrirDetalhes(id: number): void {
    this.router.navigate(['/admin/ocorrencias', id]);
  }

  protected recarregar(): void {
    this.ocorrenciasResource.reload();
  }

  protected formatarProtocolo(id: number): string {
    return `SMAP-${new Date().getFullYear()}-${String(id).padStart(6, '0')}`;
  }

  protected diasAguardando(criadaEm: string | null): number {
    if (!criadaEm) {
      return 0;
    }

    const data = new Date(criadaEm);

    if (Number.isNaN(data.getTime())) {
      return 0;
    }

    return Math.max(
      0,
      Math.floor((Date.now() - data.getTime()) / 86_400_000),
    );
  }

  protected formatarData(criadaEm: string | null): string {
    if (!criadaEm) {
      return '—';
    }

    const data = new Date(criadaEm);

    if (Number.isNaN(data.getTime())) {
      return '—';
    }

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  protected classeCategoria(categoria: string): string {
    const valor = this.normalizar(categoria);

    if (valor.includes('buraco') || valor.includes('asfalto') || valor.includes('calçada') || valor.includes('calcada')) {
      return 'cat-buraco';
    }

    if (valor.includes('ilumina') || valor.includes('poste') || valor.includes('luz')) {
      return 'cat-iluminacao';
    }

    if (valor.includes('vazamento') || valor.includes('água') || valor.includes('agua') || valor.includes('saneamento')) {
      return 'cat-vazamento';
    }

    if (valor.includes('lixo') || valor.includes('entulho') || valor.includes('coleta')) {
      return 'cat-lixo';
    }

    if (valor.includes('árvore') || valor.includes('arvore') || valor.includes('sinaliza')) {
      return 'cat-sinalizacao';
    }

    return 'cat-outros';
  }

  protected exportarCsv(): void {
    const linhas = [
      ['Codigo', 'Titulo', 'Categoria', 'Localizacao', 'Data', 'Dias aguardando'],
      ...this.ocorrenciasFiltradas().map((ocorrencia) => [
        this.formatarProtocolo(ocorrencia.id),
        ocorrencia.titulo,
        ocorrencia.categoria,
        ocorrencia.localizacao,
        this.formatarData(ocorrencia.criadaEm),
        String(this.diasAguardando(ocorrencia.criadaEm)),
      ]),
    ];

    const conteudo = linhas
      .map((linha) =>
        linha.map((campo) => `"${campo.replaceAll('"', '""')}"`).join(';'),
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

  private normalizar(texto: string | null | undefined): string {
    return (texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}