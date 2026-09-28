import { Service, signal } from '@angular/core';
import { CadastroInterface } from '../../container-cadastro/form-cadastro/cadastro-interface';

@Service()
export class UserService {
  // avatars = [
  //   { id: '1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix' },
  //   { id: '2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Coco' },
  //   { id: '3', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Gizmo' },
  //   { id: '4', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe' },
  //   { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bandit' },
  //   { id: '6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Precious' },
  // ];
  // selecionaravatar = signal<string | null>(null);

  usuarios = signal<CadastroInterface[]>([]); //recebe todos os cadastros

  cadastrar(usuario: CadastroInterface) {
    this.usuarios.update((usuarios) => [...usuarios, usuario]); //ao cadastrar mais uma pessoa, a array n substitui oq ja esta cadastrado, apenas adiciona mais um na array
    console.log(this.usuarios());
  }
}
