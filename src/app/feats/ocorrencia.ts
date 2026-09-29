export type StatusOcorrencia = 'PENDENTE' | 'EM_ANDAMENTO' | 'RESOLVIDA';

export interface Ocorrencia {
  id?: number;
  categoria: string;
  descricao: string;
  latitude?: number | null;
  longitude?: number | null;
  criadaEm?: string | null;
  titulo: string;
  localizacao: string;
  status?: StatusOcorrencia;
  imagemUrl?: string | null;
}

export type NovaOcorrencia = Omit<Ocorrencia, 'id' | 'criadaEm'>;
