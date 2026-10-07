export interface Ocorrencia {
  id?: number;
  categoria: string;
  descricao: string;
  latitude?: number | null;
  longitude?: number | null;
  criadaEm: string;
  titulo: string;
  localizacao: string;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'RESOLVIDA';
  imagemUrl?: string | null;
}
