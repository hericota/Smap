import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  readonly itens = [
    {
      nome: 'Início',
      rota: '/home',
      icone: 'M3 10 12 3l9 7v11h-6v-8H9v8H3Z',
    },
    {
      nome: 'Mapa',
      rota: '/mapa',
      icone: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16',
    },
    {
      nome: 'Ocorrências',
      rota: '/ocorrencias',
      icone: 'M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1',
    },
    {
      nome: 'Perfil',
      rota: '/perfil',
      icone: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2',
    },
  ];
}