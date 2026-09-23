import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Ocorrencia } from '../ocorrencia';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Service()
export class ConsumoApi {
    private route = inject(ActivatedRoute);
    private readonly httpClient = inject(HttpClient);
    private readonly urlApi = `${environment.apiUrl.replace(/\/+$/, '')}/ocorrencias`;
    id = this.route.snapshot.paramMap.get('id')

    cadastrarOcorrencia(ocorrencia:Ocorrencia){
        return this.httpClient.post<Ocorrencia>(this.urlApi, ocorrencia)
    }

    listarOcorrencias() {
        return this.httpClient.get<Ocorrencia[]>(this.urlApi);
    }

    pegarOcorrencia() {
        return this.httpClient.get<Ocorrencia[]>(this.urlApi+"/"+this.id);
    }

    // readonly listarOcorrencias = httpResource<Ocorrencia[]>(
    //     () => this.urlApi,
    //     {defaultValue:[]}
    // )

}
