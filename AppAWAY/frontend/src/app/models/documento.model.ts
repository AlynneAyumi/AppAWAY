export interface Documento {
  id?: number;
  assistidoId: number;
  assistido?: Assistido;
  nome: string;
  tipo: TipoDocumento;
  descricao?: string;
  arquivo: string;
  dataUpload: Date;
  dataVencimento?: Date;
  ativo: boolean;
}

export enum TipoDocumento {
  RG = 'RG',
  CPF = 'CPF',
  COMPROVANTE_RESIDENCIA = 'COMPROVANTE_RESIDENCIA',
  CERTIDAO_CRIMINAL = 'CERTIDAO_CRIMINAL',
  RELATORIO_SOCIAL = 'RELATORIO_SOCIAL',
  OUTROS = 'OUTROS'
}

export interface DocumentoFiltro {
  assistidoId?: number;
  tipo?: TipoDocumento;
  ativo?: boolean;
  page?: number;
  size?: number;
}

import { Assistido } from './assistido.model';
