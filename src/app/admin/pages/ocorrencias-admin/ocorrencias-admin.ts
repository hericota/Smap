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
  private readonly urlApi =
    `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

  protected readonly ocorrenciaDetail = httpResource<Ocorrencia[]>(
    () => this.urlApi
  );
}
