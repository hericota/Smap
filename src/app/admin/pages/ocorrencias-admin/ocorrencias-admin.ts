import { Component, inject, signal } from '@angular/core';
import { ConsumoApi } from '../../../feats/posts/consumo-api';
import { Ocorrencia } from '../../../feats/ocorrencia';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { httpResource } from '@angular/common/http';

@Component({
  imports: [],
  selector: 'app-ocorrencias-admin',
  styleUrl: './ocorrencias-admin.css',
  templateUrl: './ocorrencias-admin.html',
})
export class OcorrenciasAdmin {
 protected consumoService = inject(ConsumoApi)
private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

  private route = inject(ActivatedRoute);

  


  // colocando o valor do ID na variavel id
  id = this.route.snapshot.paramMap.get('id')
  
  // metodo get
   readonly ocorrenciaDetail = httpResource<Ocorrencia[]>(
        () => this.urlApi+'/'+ this.id
    )


}
