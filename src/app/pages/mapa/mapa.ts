import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { FormsModule, NgForm } from '@angular/forms';
import { Header } from '../../component/header/header';
import { Ocorrencia } from '../../feats/ocorrencia';
import { ConsumoApi } from '../../feats/posts/consumo-api';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-mapa',
  imports: [FormsModule, Header, BottomNav],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit, OnDestroy {

  readonly consumoService = inject(ConsumoApi);
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ocorrenciaModel = signal<Ocorrencia>({
    categoria: '',
    descricao: '',
    latitude: 0,
    longitude: 0,
    criadaEm: '',
    titulo: '',
    localizacao: '',
  });

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  protected readonly tileError = signal(false);
  readonly categorias = ['Vias públicas', 'Iluminação', 'Lixo e limpeza', 'Alagamento', 'Sinalização', 'Acessibilidade', 'Outros'];
  readonly ponto = signal<{ latitude: number; longitude: number; precisao?: number } | null>(null);
  readonly localizando = signal(false);
  readonly mensagem = signal('');
  readonly erro = signal('');
  readonly erroCarregamento = signal('');
  readonly carregando = signal(false);
  readonly salvando = signal(false);
  readonly ocorrencias = signal<Ocorrencia[]>([]);
  private selecao?: L.CircleMarker;
  private registros = L.layerGroup();
  private requestId = 0;
  private destroyed = false;
  private map?: L.Map;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
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
      this.selecionar(event.latlng.lat, event.latlng.wrap().lng);
    });
    this.carregar();

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

  localizar(): void {
    this.erro.set('');
    this.mensagem.set('');
    if (!navigator.geolocation) {
      this.erro.set('Seu navegador não oferece localização. Selecione um ponto no mapa.');
      return;
    }
    const request = ++this.requestId;
    this.localizando.set(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (this.destroyed || request !== this.requestId) return;
        this.localizando.set(false);
        this.selecionar(coords.latitude, coords.longitude, coords.accuracy);
        this.map?.setView([coords.latitude, coords.longitude], 16);
      },
      (error) => {
        if (this.destroyed || request !== this.requestId) return;
        this.localizando.set(false);
        this.erro.set(error.code === 1
          ? 'Permissão de localização negada. Escolha o ponto no mapa ou habilite a permissão no navegador.'
          : 'Não foi possível obter sua localização. Tente novamente ou escolha o ponto no mapa.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  private selecionar(latitude: number, longitude: number, precisao?: number): void {
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      this.erro.set('Selecione um ponto válido no mapa.');
      return;
    }
    this.ponto.set({ latitude, longitude, precisao });
    this.erro.set('');
    this.mensagem.set('');
    this.selecao?.remove();
    this.selecao = L.circleMarker([latitude, longitude], {
      radius: 10, color: '#175cd3', fillOpacity: 0.5, interactive: false,
    }).addTo(this.map!);
  }

  cadastrar(form: NgForm, event?: SubmitEvent): void {
    if (event) {
      event.preventDefault();
    }
    if (this.salvando()) return;

    this.erro.set('');
    this.mensagem.set('');

    const ponto = this.ponto();
    const dados = this.ocorrenciaModel();

    // 1. Validação dos campos e da seleção de mapa
    if (form.invalid || !ponto || !dados.titulo.trim() || !dados.localizacao.trim() || !this.categorias.includes(dados.categoria) || dados.descricao.trim().length < 10 || dados.descricao.length > 1000) {
      form.control.markAllAsTouched();
      this.erro.set('Preencha os campos obrigatórios (descrição com no mínimo 10 caracteres) e selecione um ponto no mapa.');
      return;
    }

    // 2. Monta o objeto completo incluindo todos os campos da interface Ocorrencia
    const registro: Ocorrencia = {
      ...dados,
      titulo: dados.titulo.trim(),
      localizacao: dados.localizacao.trim(),
      descricao: dados.descricao.trim(),
      latitude: ponto.latitude,
      longitude: ponto.longitude,
      criadaEm: new Date().toISOString(),
    };

    // 3. Executa a requisição HTTP
    this.salvando.set(true);
    this.consumoService.cadastrarOcorrencia(registro).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.salvando.set(false)),
    ).subscribe({
      next: () => {

        this.router.navigate(['/confirmacao-ocorrencia']);

        // Reseta formulários e estado
        this.ocorrenciaModel.set({
          categoria: '',
          descricao: '',
          latitude: 0,
          longitude: 0,
          criadaEm: '',
          titulo: '',
          localizacao: '',
        });

        form.resetForm();

        this.renderizar();
        this.requestId++;
        this.localizando.set(false);
        this.selecao?.remove();
        this.ponto.set(null);
        this.mensagem.set('Ocorrência enviada ao servidor.');
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(error.status === 0
          ? 'Não foi possível conectar à API. Verifique se o servidor está disponível e tente novamente.'
          : 'O servidor não conseguiu salvar a ocorrência. Confira os dados e tente novamente.');
      }

    });
  }

  carregar(): void {
    if (this.carregando()) return;
    this.carregando.set(true);
    this.erroCarregamento.set('');
    this.consumoService.listarOcorrencias().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.carregando.set(false)),
    ).subscribe({
      next: (registros) => {
        if (!Array.isArray(registros)) {
          this.erroCarregamento.set('A API retornou uma lista de ocorrências em formato inesperado.');
          return;
        }
        this.ocorrencias.set(registros.filter((item) => item != null));
        this.renderizar();
        const pontos = this.ocorrencias().filter((item) => this.temCoordenadas(item));
        if (pontos.length) {
          this.map?.fitBounds(pontos.map((o) => [o.latitude!, o.longitude!] as L.LatLngTuple),
            { maxZoom: 16, padding: [24, 24] });
        }
      },
      error: () => this.erroCarregamento.set('Não foi possível carregar as ocorrências da API. Tente novamente quando o servidor estiver disponível.'),
    });
  }

  private temCoordenadas(registro: Ocorrencia): registro is Ocorrencia & { latitude: number; longitude: number } {
    return Number.isFinite(registro.latitude) && Math.abs(registro.latitude!) <= 90 &&
      Number.isFinite(registro.longitude) && Math.abs(registro.longitude!) <= 180;
  }

  private renderizar(): void {
    this.registros.clearLayers();
    for (const registro of this.ocorrencias()) {
      if (this.temCoordenadas(registro)) {
        const popup = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = registro.titulo || registro.categoria;
        const description = document.createElement('p');
        description.textContent = registro.descricao;
        popup.append(title, description);

        L.circleMarker([registro.latitude, registro.longitude], {
          radius: 9, color: '#13795b', fillOpacity: 0.8, bubblingMouseEvents: false,
        }).bindPopup(popup).addTo(this.registros);
      }
    }
  }
}

