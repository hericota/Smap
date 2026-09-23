import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-pagina-offline',
  styleUrl: './pagina-offline.css',
  templateUrl: './pagina-offline.html',
})
export class PaginaOffline {
  recarregar() {
    window.location.reload();
  }
}
