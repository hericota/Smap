import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { FormsModule, NgForm } from '@angular/forms';
import { Header } from '../../component/header/header';
import { Ocorrencia } from '../../feats/ocorrencia';
import { form, required } from '@angular/forms/signals';
import { ConsumoApi } from '../../feats/posts/consumo-api';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';

const STORAGE_KEY = 'smap.ocorrencias.v1';

@Component({
  selector: 'app-mapa',
  imports: [FormsModule, Header, BottomNav],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit, OnDestroy {

  readonly consumoService = inject(ConsumoApi);
  readonly router = inject(Router);

  ocorrenciaModel = signal<Ocorrencia>({
    categoria: '',
    descricao: '',
    latitude: 0,
    longitude: 0,
    criadaEm: '',
    titulo: '',
    localizacao: '',
  });

  ocorrenciaForm = form(this.ocorrenciaModel, (s) => {
    required(s.categoria, { message: 'Campo Obrigatório' });
    required(s.descricao, { message: 'Campo Obrigatório' });
    required(s.titulo, { message: 'Campo Obrigatório' });
    required(s.localizacao, { message: 'Campo Obrigatório' });
  });

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  protected readonly tileError = signal(false);
  readonly categorias = ['Vias públicas', 'Iluminação', 'Lixo e limpeza', 'Alagamento', 'Sinalização', 'Acessibilidade', 'Outros'];
  readonly ponto = signal<{ latitude: number; longitude: number; precisao?: number } | null>(null);
  readonly localizando = signal(false);
  readonly mensagem = signal('');
  readonly erro = signal('');
  readonly ocorrencias = signal<Ocorrencia[]>([]);
  private selecao?: L.CircleMarker;
  private registros = L.layerGroup();
  private requestId = 0;
  private destroyed = false;
  private storageReady = true;
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

    this.erro.set('');
    this.mensagem.set('');

    const ponto = this.ponto();
    const dados = this.ocorrenciaModel();

    // 1. Validação dos campos e da seleção de mapa
    if (form.invalid || !ponto || !this.categorias.includes(dados.categoria) || dados.descricao.trim().length < 10 || dados.descricao.length > 1000) {
      form.control.markAllAsTouched();
      this.erro.set('Preencha os campos obrigatórios (descrição com no mínimo 10 caracteres) e selecione um ponto no mapa.');
      return;
    }

    if (!this.storageReady) {
      this.erro.set('O armazenamento local não pôde ser lido. Libere o armazenamento do navegador e recarregue antes de salvar.');
      return;
    }

    // 2. Monta o objeto completo incluindo todos os campos da interface Ocorrencia
    const registro: Ocorrencia = {
      ...dados,
      id: Date.now(),
      descricao: dados.descricao.trim(),
      latitude: ponto.latitude,
      longitude: ponto.longitude,
      criadaEm: new Date().toISOString(),
    };

    // 3. Executa a requisição HTTP
    this.consumoService.cadastrarOcorrencia(registro).subscribe({
      next: (response) => {
        console.log('Ocorrência cadastrada:', response.titulo, response.categoria);

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

        this.ocorrenciaForm().reset();
        form.resetForm();

        this.renderizar();
        this.requestId++;
        this.localizando.set(false);
        this.selecao?.remove();
        this.ponto.set(null);
        this.mensagem.set('Ocorrência salva neste navegador e adicionada ao mapa.');
      },
      error: (error) => {
        console.error('ERRO AO CADASTRAR:', error);
        this.erro.set('Ocorreu um erro ao enviar para o servidor. Tente novamente.');
      }

    });
  }

  private lerRegistros(): Ocorrencia[] {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(data) || !data.every((item) =>
      item &&
      (typeof item.id === 'string' || typeof item.id === 'number') &&
      this.categorias.includes(item.categoria) &&
      typeof item.descricao === 'string' && item.descricao.length <= 1000 &&
      typeof item.titulo === 'string' &&
      typeof item.localizacao === 'string' &&
      Number.isFinite(item.latitude) && Math.abs(item.latitude) <= 90 &&
      Number.isFinite(item.longitude) && Math.abs(item.longitude) <= 180 &&
      typeof item.criadaEm === 'string'
    )) throw new Error('Dados locais inválidos');
    return data;
  }

  private carregar(): void {
    try {
      this.ocorrencias.set(this.lerRegistros());
      this.renderizar();
      if (this.ocorrencias().length) {
        this.map?.fitBounds(
          this.ocorrencias().map((o) => [o.latitude!, o.longitude!] as L.LatLngTuple),
          { maxZoom: 16, padding: [24, 24] }
        );
      }
    } catch {
      this.storageReady = false;
      this.erro.set('Não foi possível ler os registros deste navegador. Os dados existentes não foram alterados.');
    }
  }

  private renderizar(): void {
    this.registros.clearLayers();
    for (const registro of this.ocorrencias()) {
      if (registro.latitude != null && registro.longitude != null) {
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

