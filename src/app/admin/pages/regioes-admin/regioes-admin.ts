import { Component } from '@angular/core';

interface RegiaoCritica {
  nome: string;
  total: number;
  altaPrioridade: number;
  tempoMedioDias: number;
}

@Component({
  imports: [],
  selector: 'app-regioes-admin',
  styleUrl: './regioes-admin.css',
  templateUrl: './regioes-admin.html',
})
export class RegioesAdmin {
  protected readonly regioesCriticas: RegiaoCritica[] = [
    {
      nome: 'Centro Histórico',
      total: 423,
      altaPrioridade: 14,
      tempoMedioDias: 2.4,
    },
    {
      nome: 'Vila Nova',
      total: 289,
      altaPrioridade: 5,
      tempoMedioDias: 4.1,
    },
    {
      nome: 'Itoupava Norte',
      total: 212,
      altaPrioridade: 2,
      tempoMedioDias: 3.2,
    },
    {
      nome: 'Escola Agrícola',
      total: 178,
      altaPrioridade: 1,
      tempoMedioDias: 5.0,
    },
    {
      nome: 'Garcia',
      total: 145,
      altaPrioridade: 1,
      tempoMedioDias: 4.5,
    },
  ];
}