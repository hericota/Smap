import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomNav } from '../bottom-nav/bottom-nav';

@Component({
  imports: [RouterLink, BottomNav],
  selector: 'app-pagina-offline',
  styleUrl: './pagina-offline.css',
  templateUrl: './pagina-offline.html',
})
export class PaginaOffline {
  recarregar() {
    window.location.reload();
  };

  // Função disparada pelo clique
  botaoRecarregar(event: Event): void {
    event.preventDefault(); 
    window.location.reload();}

}
