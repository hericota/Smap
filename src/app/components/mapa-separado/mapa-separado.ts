import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

import { ConsumoApi } from '../../feats/posts/consumo-api';
import { Ocorrencia } from '../../feats/ocorrencia';

@Component({
  imports: [FormsModule],
  selector: 'app-mapa-separado',
  styleUrl: './mapa-separado.css',
  templateUrl: './mapa-separado.html',
})
export class MapaSeparado implements AfterViewInit, OnDestroy {
  private readonly consumoApi = inject(ConsumoApi);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  protected readonly tileError = signal(false);

  readonly categorias = [
    'Vias públicas',
    'Iluminação',
    'Lixo e limpeza',
    'Alagamento',
    'Sinalização',
    'Acessibilidade',
    'Outros',
  ];

  categoria = '';
  descricao = '';

  readonly ponto = signal<{
    latitude: number;
    longitude: number;
    precisao?: number;
  } | null>(null);

  readonly localizando = signal(false);
  readonly mensagem = signal('');
  readonly erro = signal('');
  readonly ocorrencias = signal<Ocorrencia[]>([]);

  private readonly registros = L.layerGroup();
  private map?: L.Map;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [-14.235, -51.9253],
      4,
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">' +
        'OpenStreetMap</a> contributors',
    })
      .on('tileerror', () => this.tileError.set(true))
      .addTo(this.map);

    this.registros.addTo(this.map);
    this.carregarOcorrencias();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.map?.invalidateSize();
      });

      this.resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  private carregarOcorrencias(): void {
    this.consumoApi
      .listarOcorrencias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ocorrencias) => {
          this.registros.clearLayers();

          if (!Array.isArray(ocorrencias)) {
            this.erro.set('A API retornou uma lista inválida.');
            return;
          }

          this.erro.set('');

          this.ocorrencias.set(
            ocorrencias.filter((ocorrencia) => ocorrencia != null),
          );

          for (const ocorrencia of this.ocorrencias()) {
            const { latitude, longitude } = ocorrencia;

            if (
              typeof latitude !== 'number' ||
              typeof longitude !== 'number' ||
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude) ||
              Math.abs(latitude) > 90 ||
              Math.abs(longitude) > 180
            ) {
              continue;
            }

            const marcador = L.circleMarker([latitude, longitude], {
              radius: 9,
              color: '#13795b',
              fillColor: '#13795b',
              fillOpacity: 0.8,
              weight: 2,
            });

            marcador.bindTooltip(
              this.criarConteudoOcorrencia(ocorrencia),
              {
                direction: 'top',
                offset: L.point(0, -10),
                opacity: 0.96,
                sticky: true,
                className: 'tooltip-ocorrencia',
              },
            );

            marcador.addTo(this.registros);
          }
        },
        error: () => {
          this.erro.set('Não foi possível carregar as ocorrências.');
        },
      });
  }

  private criarConteudoOcorrencia(
    ocorrencia: Ocorrencia,
  ): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'conteudo-ocorrencia';

    const titulo = document.createElement('strong');
    titulo.className = 'conteudo-ocorrencia__titulo';
    titulo.textContent = ocorrencia.titulo || 'Ocorrência';
    container.appendChild(titulo);

    this.adicionarInformacao(
      container,
      'Categoria',
      ocorrencia.categoria,
    );

    this.adicionarInformacao(
      container,
      'Descrição',
      ocorrencia.descricao,
    );

    this.adicionarInformacao(
      container,
      'Localização',
      ocorrencia.localizacao,
    );

    const dataFormatada = this.formatarData(ocorrencia.criadaEm);

    if (dataFormatada) {
      this.adicionarInformacao(
        container,
        'Registrada em',
        dataFormatada,
      );
    }

    return container;
  }

  private adicionarInformacao(
    container: HTMLElement,
    rotulo: string,
    valor?: string | null,
  ): void {
    if (!valor?.trim()) {
      return;
    }

    const linha = document.createElement('div');
    linha.className = 'conteudo-ocorrencia__linha';

    const rotuloElemento = document.createElement('span');
    rotuloElemento.className = 'conteudo-ocorrencia__rotulo';
    rotuloElemento.textContent = `${rotulo}: `;

    const valorElemento = document.createElement('span');
    valorElemento.textContent = valor;

    linha.append(rotuloElemento, valorElemento);
    container.appendChild(linha);
  }

  private formatarData(valor?: string | null): string {
    if (!valor) {
      return '';
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return valor;
    }

    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(data);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }
}