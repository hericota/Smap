import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Ocorrencia } from '../ocorrencia';

@Service()
export class ConsumoApi {

    private readonly httpClient = inject(HttpClient);
    private readonly urlApi = 'http://localhost:8080/ocorrencias'

    cadastrarOcorrencia(ocorrencia:Ocorrencia){
        return this.httpClient.post<Ocorrencia>(this.urlApi, ocorrencia)
    }

    ocorrenciaRegistrada = httpResource<Ocorrencia[]>(
        () => this.urlApi,
        {defaultValue:[]}
    )

}
