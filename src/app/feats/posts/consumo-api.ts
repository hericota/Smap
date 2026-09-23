import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Ocorrencia } from '../ocorrencia';
import { environment } from '../../../environments/environment';

@Service()
export class ConsumoApi {

    private readonly httpClient = inject(HttpClient);
    private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;

    cadastrarOcorrencia(ocorrencia:Ocorrencia){
        return this.httpClient.post<Ocorrencia>(this.urlApi, ocorrencia)
    }

    listarOcorrencias() {
        return this.httpClient.get<Ocorrencia[]>(this.urlApi);
    }

}
