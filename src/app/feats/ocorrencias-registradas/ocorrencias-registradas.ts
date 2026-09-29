import { Component, inject } from '@angular/core';
import { ConsumoApi } from '../posts/consumo-api';
import { RouterLink } from '@angular/router';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { TelaOcorrencias } from '../../pages/tela-ocorrencias/tela-ocorrencias';

@Component({
  imports: [RouterLink, BottomNav, TelaOcorrencias],
  selector: 'app-ocorrencias-registradas',
  styleUrl: './ocorrencias-registradas.css',
  templateUrl: './ocorrencias-registradas.html',
})
export class OcorrenciasRegistradas {

  protected readonly consumoService = inject(ConsumoApi)

}
