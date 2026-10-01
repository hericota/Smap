import { Component, inject } from '@angular/core';
import { BottomNav } from '../../../components/bottom-nav/bottom-nav';
import { RouterLink } from '@angular/router';
import { MapaSeparado } from '../../../components/mapa-separado/mapa-separado';
import { UserService } from '../user-service/user-service';

@Component({
  imports: [BottomNav, RouterLink, MapaSeparado],
  selector: 'app-profile-home',
  styleUrl: './profile-home.css',
  templateUrl: './profile-home.html',
})
export class ProfileHome {
   private usuarioService = inject(UserService);
   
 usuarioLogado = this.usuarioService.usuarioLogado;

}
