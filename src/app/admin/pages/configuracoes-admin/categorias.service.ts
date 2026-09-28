import { Injectable, signal } from '@angular/core';

export interface Categoria {
  id: number;
  nome: string;
  icone: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private proximoId = 7;

  readonly categorias = signal<Categoria[]>([
    { id: 1, nome: 'Buraco',       icone: '🕳️' },
    { id: 2, nome: 'Iluminação',   icone: '💡' },
    { id: 3, nome: 'Lixo',         icone: '🗑️' },
    { id: 4, nome: 'Árvores',      icone: '🌳' },
    { id: 5, nome: 'Sinalização',  icone: '🚦' },
    { id: 6, nome: 'Calçadas',     icone: '🚶' },
  ]);

  criar(nome: string, icone: string): void {
    const nova: Categoria = {
      id: this.proximoId++,
      nome: nome.trim(),
      icone: icone.trim() || '📍',
    };
    this.categorias.update((lista) => [...lista, nova]);
  }

  editar(id: number, nome: string, icone: string): void {
    this.categorias.update((lista) =>
      lista.map((c) =>
        c.id === id ? { ...c, nome: nome.trim(), icone: icone.trim() || c.icone } : c,
      ),
    );
  }

  deletar(id: number): void {
    this.categorias.update((lista) => lista.filter((c) => c.id !== id));
  }
}