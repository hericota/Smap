import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriasService } from './categorias.service';

type ModoModal = 'criar' | 'editar' | 'deletar' | null;

interface PrazoResolucao {
  prioridade: string;
  cor: 'alta' | 'media' | 'baixa';
  dias: number;
}

@Component({
  selector: 'app-configuracoes-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracoes-admin.html',
  styleUrl: './configuracoes-admin.css',
})
export class ConfiguracoesAdmin {
  private readonly categoriasService = inject(CategoriasService);

  protected readonly perfil = {
    nome: 'Carlos Silva',
    email: 'carlos.silva@prefeitura.gov.br',
    papel: 'Super Admin',
    iniciais: 'CS',
  };

  protected readonly prazos: PrazoResolucao[] = [
    { prioridade: 'Alta',  cor: 'alta',  dias: 2 },
    { prioridade: 'Média', cor: 'media', dias: 5 },
    { prioridade: 'Baixa', cor: 'baixa', dias: 10 },
  ];

  protected readonly categorias = this.categoriasService.categorias;

  protected readonly modoModal = signal<ModoModal>(null);
  protected readonly categoriaEmEdicao = signal<Categoria | null>(null);

  protected readonly formNome = signal('');
  protected readonly formIcone = signal('');

  protected readonly tituloModal = computed(() => {
    switch (this.modoModal()) {
      case 'criar':   return 'Nova categoria';
      case 'editar':  return 'Editar categoria';
      case 'deletar': return 'Deletar categoria?';
      default:        return '';
    }
  });

  protected abrirCriar(): void {
    this.formNome.set('');
    this.formIcone.set('');
    this.categoriaEmEdicao.set(null);
    this.modoModal.set('criar');
  }

  protected abrirEditar(categoria: Categoria): void {
    this.formNome.set(categoria.nome);
    this.formIcone.set(categoria.icone);
    this.categoriaEmEdicao.set(categoria);
    this.modoModal.set('editar');
  }

  protected abrirDeletar(categoria: Categoria): void {
    this.categoriaEmEdicao.set(categoria);
    this.modoModal.set('deletar');
  }

  protected fecharModal(): void {
    this.modoModal.set(null);
    this.categoriaEmEdicao.set(null);
    this.formNome.set('');
    this.formIcone.set('');
  }

  protected salvar(): void {
    const nome = this.formNome().trim();
    if (!nome) return;

    if (this.modoModal() === 'criar') {
      this.categoriasService.criar(nome, this.formIcone());
    } else if (this.modoModal() === 'editar') {
      const categoria = this.categoriaEmEdicao();
      if (categoria) {
        this.categoriasService.editar(categoria.id, nome, this.formIcone());
      }
    }
    this.fecharModal();
  }

  protected confirmarDeletar(): void {
    const categoria = this.categoriaEmEdicao();
    if (categoria) {
      this.categoriasService.deletar(categoria.id);
    }
    this.fecharModal();
  }
}