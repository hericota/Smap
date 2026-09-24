import { Component, inject } from '@angular/core';
import { ConsumoApi } from '../posts/consumo-api';

@Component({
  imports: [],
  selector: 'app-ocorrencias-registradas',
  styleUrl: './ocorrencias-registradas.css',
  templateUrl: './ocorrencias-registradas.html',
})
export class OcorrenciasRegistradas {

  protected readonly consumoService = inject(ConsumoApi)

}
