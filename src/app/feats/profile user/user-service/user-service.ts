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
  
    const username = this.gerarUserName(usuario);
    const usuarioComUsername = {
      ...usuario,
      username,
    };
    this.usuarios.update((usuarios) => [...usuarios, usuarioComUsername]);
    this.salvarUsuarios();
  }

  private gerarUserName(usuario: CadastroInterface): string {
    const nome = usuario.nome.trim().replace(/\s+/g, '_');
    const sobreNome = usuario.sobreNome.trim().replace(/\s+/g, '_');
    const numero = Math.floor(Math.random() * 900) + 100;
    return `${nome}_${sobreNome}_${numero}`.toLowerCase();
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
  usuarioLogado = signal<CadastroInterface | null>(this.carregarlogin());
  login(email: string, senha: string): boolean {
    const usuario = this.usuarios().find(
      (usuario) => usuario.email === email && usuario.senha === senha,
    );
    this.usuarioLogado.set(usuario ?? null);
    console.log(this.usuarioLogado());
    this.salvarLogin();
    if (usuario) {
      return true;
    } else {
      return false;
    }
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
  logout() {
    this.usuarioLogado.set(null);
    localStorage.removeItem('usuarioLogado');
  }
}
