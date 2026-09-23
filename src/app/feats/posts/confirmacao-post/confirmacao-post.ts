import { Component, inject } from '@angular/core';
import { ConsumoApi } from '../consumo-api';

@Component({
  imports: [],
  selector: 'app-confirmacao-post',
  styleUrl: './confirmacao-post.css',
  templateUrl: './confirmacao-post.html',
})
export class ConfirmacaoPost {

  protected consumoService = inject(ConsumoApi)
  

}
