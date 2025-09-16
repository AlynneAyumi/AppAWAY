export interface Usuario {
  id?: number;
  idUsuario?: number;
  nome: string;
  nomeUser: string;
  email: string;
  senha?: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  tipoAcesso?: number;
  dataCriacao?: Date;
  dataUltimaAtualizacao?: Date;
  createdBy?: number;
  creationDate?: Date;
  lastUpdatedBy?: number;
  lastUpdateDate?: Date;
  pessoa?: Pessoa;
}

export enum PerfilUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  AGENTE = 'AGENTE'
}

export interface Pessoa {
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
  endereco?: Endereco;
}

export interface Endereco {
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

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  expiresIn: number;
}
