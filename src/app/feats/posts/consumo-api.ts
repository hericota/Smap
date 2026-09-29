import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NovaOcorrencia, Ocorrencia } from '../ocorrencia';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsumoApi {
  private readonly httpClient = inject(HttpClient);
  private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

  cadastrarOcorrencia(ocorrencia: NovaOcorrencia) {
    return this.httpClient.post<Ocorrencia>(this.urlApi, ocorrencia);
  }

  listarOcorrencias() {
    return this.httpClient.get<Ocorrencia[]>(this.urlApi);
  }

  pegarOcorrencia(id: number | string) {
    return this.httpClient.get<Ocorrencia>(`${this.urlApi}/${id}`);
  }

  atualizarOcorrencia(id: number | string, ocorrencia: NovaOcorrencia) {
    return this.httpClient.put<Ocorrencia>(`${this.urlApi}/${id}`, ocorrencia);
  }

  excluirOcorrencia(id: number | string) {
    return this.httpClient.delete<void>(`${this.urlApi}/${id}`);
  }

  readonly listarOcorrenciasResource = httpResource<Ocorrencia[]>(
    () => this.urlApi,
    { defaultValue: [] },
  );
}
