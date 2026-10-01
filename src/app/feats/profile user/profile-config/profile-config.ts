import { Component, inject } from '@angular/core';
import { BottomNav } from '../../../components/bottom-nav/bottom-nav';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user-service/user-service';

@Component({
  imports: [BottomNav, RouterLink],
  selector: 'app-profile-config',
  styleUrl: './profile-config.css',
  templateUrl: './profile-config.html',
})
export class ProfileConfig {
  
   private usuarioService = inject(UserService);
   private router = inject(Router);

  notificacao = false;
  aceitarNotificacao() {
    this.notificacao = !this.notificacao;
  }
  

  sair(){
    this.usuarioService.logout().subscribe({ error: () => { /* Local session is already cleared. */ } });
    void this.router.navigate(['/login']);
  }
  usuarioLogado = this.usuarioService.usuarioLogado;
}
