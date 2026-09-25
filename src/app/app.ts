import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { PaginaOffline } from './components/pagina-offline/pagina-offline';
import { NetworkService } from './core/services/network-service';

@Component({
  imports: [RouterOutlet, Footer, PaginaOffline],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Smap');
  networkService = inject(NetworkService);
}
