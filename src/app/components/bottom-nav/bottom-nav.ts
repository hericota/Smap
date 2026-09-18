import { Component, input, output } from '@angular/core';

export type Aba = 'inicio' | 'mapa' | 'ocorrencias' | 'perfil';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  ativa = input<Aba>('mapa');
  selecionar = output<Aba>();
  adicionar = output<void>();

  readonly itens: { id: Aba; nome: string; icone: string }[] = [
    {
      id: 'inicio',
      nome: 'Início',
      icone: 'M3 10 12 3l9 7v11h-6v-8H9v8H3Z',
    },
    {
      id: 'mapa',
      nome: 'Mapa',
      icone: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16',
    },
    {
      id: 'ocorrencias',
      nome: 'Ocorrências',
      icone: 'M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1',
    },
    {
      id: 'perfil',
      nome: 'Perfil',
      icone: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2',
    },
  ];
}