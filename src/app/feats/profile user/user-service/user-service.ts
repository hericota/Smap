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

  //cadastro
  usuarios = signal<CadastroInterface[]>(this.carregarUsuarios()); //recebe todos os cadastros

  cadastrar(usuario: CadastroInterface) {
    this.usuarios.update((usuarios) => [...usuarios, usuario]); //ao cadastrar mais uma pessoa, a array n substitui oq ja esta cadastrado, apenas adiciona mais um na array
    this.salvarUsuarios();
    console.log(this.usuarios());
  }
  private salvarUsuarios() {
    //transforma o objeto em um texto para armazenar no local
    const dados = JSON.stringify(this.usuarios());
    localStorage.setItem('usuarios', dados);
  }

  private carregarUsuarios(): CadastroInterface[] {
    const dados = localStorage.getItem('usuarios');

    if (dados) {
      return JSON.parse(dados);
    }

    return [];
  }

  //login
  usuarioLogado = signal<CadastroInterface | null>(this.carregarlogin());;
  login(email: string, senha: string): boolean {
    const usuario = this.usuarios().find(
      (usuario) => usuario.email === email && usuario.senha === senha,
    ); 
    this.usuarioLogado.set(usuario ?? null); console.log(this.usuarioLogado());
    this.salvarLogin() ;
    if (usuario) {
      return true;
    }else{return false}
    
 
  }

  private salvarLogin() {
    const dadosLogin = JSON.stringify(this.usuarioLogado());
    localStorage.setItem('usuarioLogado', dadosLogin);
  }

   private carregarlogin(): CadastroInterface | null {
    const dadosLogin = localStorage.getItem('usuarioLogado');

    if (dadosLogin) {
      return JSON.parse(dadosLogin);
    }
      return null;
  }
}
