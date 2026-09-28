import { Component, inject } from '@angular/core';
import { ConsumoApi } from '../posts/consumo-api';
import { httpResource } from '@angular/common/http';
import { Ocorrencia } from '../ocorrencia';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';

@Component({
  imports: [BottomNav],
  selector: 'app-detalhe-ocorrecia',
  styleUrl: './detalhe-ocorrecia.css',
  templateUrl: './detalhe-ocorrecia.html',
})
export class DetalheOcorrecia {
  // protected readonly consumoService = inject(ConsumoApi);

   private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;
   private route = inject(ActivatedRoute);


  // colocando o valor do ID na variavel id
  id = this.route.snapshot.paramMap.get('id')
  
  // metodo get
   readonly ocorrenciaDetail = httpResource<Ocorrencia>(
        () => this.urlApi+'/'+ this.id
    )

    constructor() {
  console.log('ID:', this.id);
}
}
