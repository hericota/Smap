import { Component, inject } from '@angular/core';
import { ConsumoApi } from '../posts/consumo-api';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-ocorrencias-registradas',
  styleUrl: './ocorrencias-registradas.css',
  templateUrl: './ocorrencias-registradas.html',
})
export class OcorrenciasRegistradas {

  protected readonly consumoService = inject(ConsumoApi)

}
