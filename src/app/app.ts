import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaginaOffline } from './components/pagina-offline/pagina-offline';
import { NetworkService } from './core/services/network-service';

@Component({
  imports: [RouterOutlet, PaginaOffline],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Smap');
  networkService = inject(NetworkService);
}
