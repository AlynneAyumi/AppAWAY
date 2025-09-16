export interface Assistido {
  id?: number;
  idAssistido?: number;
  nome: string;
  cpf: string;
  numeroProcesso: string;
  numProcesso?: string;
  tipoPena: TipoPena;
  status: StatusAssistido;
  dataNascimento?: Date;
  endereco?: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
  observacao?: string;
  dataCadastro?: Date;
  dataUltimaAtualizacao?: Date;
  statusComparecimento?: EnumSituacao;
  ultimoComparecimento?: Date;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
  pessoa?: PessoaAssistido;
  comparecimentos?: Comparecimento[];
  tipoMonitoramento?: TipoMonitoramento;
  tipoRegime?: TipoRegime;
  tipoSituacao?: TipoSituacao;
  varaExecPenal?: VaraExecPenal;
}

export enum StatusAssistido {
  ATIVO = 'ATIVO',
  EM_MONITORAMENTO = 'EM_MONITORAMENTO',
  DESLIGADO = 'DESLIGADO'
}

export enum TipoPena {
  ALTERNATIVA = 'ALTERNATIVA',
  PRISIONAL = 'PRISIONAL'
}

export interface PessoaAssistido {
  idPessoa?: number;
  cpf: string;
  nome: string;
  segundoNome: string;
  dataNascimento?: Date;
  telefone: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
  endereco?: EnderecoAssistido;
}

export interface EnderecoAssistido {
  idEndereco?: number;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
}

export interface Comparecimento {
  idComparecimento?: number;
  data: Date;
  flagComparecimento: boolean;
  observacoes?: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
  assistido?: Assistido;
}

export interface TipoMonitoramento {
  idTipoMonitoramento?: number;
  descricao?: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
}

export interface TipoRegime {
  idTipoRegime?: number;
  descricao?: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
}

export interface TipoSituacao {
  idTipoSituacao?: number;
  descricao?: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
}

export interface VaraExecPenal {
  idVaraExecPenal?: number;
  descricao?: string;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
}

export enum EnumSituacao {
  PENDENTE = 'PENDENTE',
  COMPARECEU = 'COMPARECEU'
}

export interface AssistidoFiltro {
  nome?: string;
  cpf?: string;
  numProcesso?: string;
  status?: StatusAssistido;
  tipoPena?: TipoPena;
  statusComparecimento?: EnumSituacao;
  page?: number;
  size?: number;
}

export interface ComparecimentoFiltro {
  assistidoId?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status?: EnumSituacao;
  page?: number;
  size?: number;
}
