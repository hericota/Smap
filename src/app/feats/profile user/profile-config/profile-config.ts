import { Component, inject } from '@angular/core';
import { BottomNav } from '../../../components/bottom-nav/bottom-nav';
import { RouterLink } from '@angular/router';
import { UserService } from '../user-service/user-service';

@Component({
  imports: [BottomNav, RouterLink],
  selector: 'app-profile-config',
  styleUrl: './profile-config.css',
  templateUrl: './profile-config.html',
})
export class ProfileConfig {
  
   private usuarioService = inject(UserService);

  notificacao = false;
  aceitarNotificacao() {
    this.notificacao = !this.notificacao;
  }
  

  sair(){
    this.usuarioService.logout()
  }
  usuarioLogado = this.usuarioService.usuarioLogado;
}
