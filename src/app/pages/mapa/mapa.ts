import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule, NgForm } from '@angular/forms';
import { Header } from '../../component/header/header';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';

interface Ocorrencia {
  id: string;
  categoria: string;
  descricao: string;
  latitude: number;
  longitude: number;
  criadaEm: string;
}
const STORAGE_KEY = 'smap.ocorrencias.v1';

@Component({
  selector: 'app-mapa',
  imports: [FormsModule, Header, BottomNav],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  protected readonly tileError = signal(false);
  readonly categorias = ['Vias públicas', 'Iluminação', 'Lixo e limpeza', 'Alagamento', 'Sinalização', 'Acessibilidade', 'Outros'];
  categoria = '';
  descricao = '';
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
    // Localização só é solicitada quando o usuário toca no botão.
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

  cadastrar(form: NgForm): void {
    this.erro.set('');
    this.mensagem.set('');
    const ponto = this.ponto();
    if (form.invalid || !ponto || !this.categorias.includes(this.categoria) || this.descricao.trim().length < 10 || this.descricao.length > 1000) {
      form.control.markAllAsTouched();
      this.erro.set('Escolha a categoria, descreva o problema com pelo menos 10 caracteres e confirme um ponto no mapa.');
      return;
    }
    if (!this.storageReady) {
      this.erro.set('O armazenamento local não pôde ser lido. Libere o armazenamento do navegador e recarregue antes de salvar.');
      return;
    }
    const registro: Ocorrencia = {
      id: crypto.randomUUID(), categoria: this.categoria, descricao: this.descricao.trim(),
      latitude: ponto.latitude, longitude: ponto.longitude, criadaEm: new Date().toISOString(),
    };
    try {
      // Releitura evita sobrescrever registros salvos por outra aba desde a abertura.
      const registros = [...this.lerRegistros(), registro];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
      this.ocorrencias.set(registros);
    } catch {
      this.erro.set('Não foi possível salvar. O armazenamento pode estar cheio ou indisponível. Seus dados permanecem no formulário.');
      return;
    }
    this.renderizar();
    this.requestId++;
    this.localizando.set(false);
    this.selecao?.remove();
    this.ponto.set(null);
    form.resetForm({ categoria: '', descricao: '' });
    this.mensagem.set('Ocorrência salva neste navegador e adicionada ao mapa.');
  }

  private lerRegistros(): Ocorrencia[] {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(data) || !data.every((item) =>
      item && typeof item.id === 'string' && this.categorias.includes(item.categoria) &&
      typeof item.descricao === 'string' && item.descricao.length <= 1000 &&
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
        this.map?.fitBounds(this.ocorrencias().map((o) => [o.latitude, o.longitude] as L.LatLngTuple), { maxZoom: 16, padding: [24, 24] });
      }
    } catch {
      this.storageReady = false;
      this.erro.set('Não foi possível ler os registros deste navegador. Os dados existentes não foram alterados.');
    }
  }

  private renderizar(): void {
    this.registros.clearLayers();
    for (const registro of this.ocorrencias()) {
      const popup = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = registro.categoria;
      const description = document.createElement('p');
      description.textContent = registro.descricao;
      popup.append(title, description);
      L.circleMarker([registro.latitude, registro.longitude], {
        radius: 9, color: '#13795b', fillOpacity: 0.8, bubblingMouseEvents: false,
      }).bindPopup(popup).addTo(this.registros);
    }
  }
}
