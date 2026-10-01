import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ocorrencia } from '../ocorrencia';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsumoApi {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');
  private readonly urlApi = `${this.baseUrl}/ocorrencias`;

  cadastrarOcorrencia(ocorrencia: Ocorrencia) {
    return this.httpClient.post<Ocorrencia>(this.urlApi, ocorrencia);
  }

  enviarImagem(arquivo: File) {
    const dados = new FormData();
    dados.append('arquivo', arquivo, arquivo.name);

    return this.httpClient.post<{ url: string }>(`${this.baseUrl}/uploads/imagens`, dados);
  }

  listarOcorrencias() {
    return this.httpClient.get<Ocorrencia[]>(this.urlApi);
  }

  pegarOcorrencia(id: number | string) {
    return this.httpClient.get<Ocorrencia>(`${this.urlApi}/${id}`);
  }

  readonly listarOcorrenciasResource = httpResource<Ocorrencia[]>(
    () => this.urlApi,
    { defaultValue: [] },
  );
}
