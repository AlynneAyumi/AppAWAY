import { Injectable } from '@angular/core';
import { Assistido, PessoaAssistido, Comparecimento } from '../models/assistido.model';
import { Usuario, Pessoa } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() { }

  // Mapear Assistido do backend para o formato esperado pelo frontend
  mapAssistidoFromBackend(backendAssistido: any): Assistido {
    return {
      id: backendAssistido.id || backendAssistido.idAssistido,
      idAssistido: backendAssistido.idAssistido,
      nome: backendAssistido.nome || (backendAssistido.pessoa ? `${backendAssistido.pessoa.nome} ${backendAssistido.pessoa.segundoNome}`.trim() : 'Nome não disponível'),
      cpf: backendAssistido.cpf || (backendAssistido.pessoa ? backendAssistido.pessoa.cpf : ''),
      numeroProcesso: backendAssistido.numeroProcesso || backendAssistido.numProcesso || '',
      tipoPena: backendAssistido.tipoPena || 'ALTERNATIVA',
      status: backendAssistido.status || 'ATIVO',
      dataNascimento: backendAssistido.dataNascimento ? new Date(backendAssistido.dataNascimento) : (backendAssistido.pessoa ? new Date(backendAssistido.pessoa.dataNascimento) : undefined),
      endereco: backendAssistido.endereco || this.formatarEndereco(backendAssistido.pessoa?.endereco),
      telefone: backendAssistido.telefone || (backendAssistido.pessoa ? backendAssistido.pessoa.telefone : ''),
      email: backendAssistido.email || (backendAssistido.pessoa ? backendAssistido.pessoa.email : ''),
      observacoes: backendAssistido.observacoes || backendAssistido.observacao || '',
      dataCadastro: backendAssistido.dataCadastro ? new Date(backendAssistido.dataCadastro) : (backendAssistido.creationDate ? new Date(backendAssistido.creationDate) : undefined),
      dataUltimaAtualizacao: backendAssistido.dataUltimaAtualizacao ? new Date(backendAssistido.dataUltimaAtualizacao) : (backendAssistido.lastUpdateDate ? new Date(backendAssistido.lastUpdateDate) : undefined),
      statusComparecimento: backendAssistido.statusComparecimento,
      ultimoComparecimento: backendAssistido.ultimoComparecimento ? new Date(backendAssistido.ultimoComparecimento) : undefined,
      createdBy: backendAssistido.createdBy || (backendAssistido.creationDate ? new Date(backendAssistido.creationDate) : undefined),
      creationDate: backendAssistido.creationDate ? new Date(backendAssistido.creationDate) : undefined,
      lastUpdatedBy: backendAssistido.lastUpdatedBy || (backendAssistido.lastUpdateDate ? new Date(backendAssistido.lastUpdateDate) : undefined),
      lastUpdateDate: backendAssistido.lastUpdateDate ? new Date(backendAssistido.lastUpdateDate) : undefined,
      pessoa: backendAssistido.pessoa ? this.mapPessoaAssistidoFromBackend(backendAssistido.pessoa) : undefined,
      comparecimentos: backendAssistido.comparecimentos ? backendAssistido.comparecimentos.map((c: any) => this.mapComparecimentoFromBackend(c)) : [],
      tipoMonitoramento: backendAssistido.tipoMonitoramento,
      tipoRegime: backendAssistido.tipoRegime,
      tipoSituacao: backendAssistido.tipoSituacao,
      varaExecPenal: backendAssistido.varaExecPenal
    };
  }

  // Mapear PessoaAssistido do backend
  mapPessoaAssistidoFromBackend(backendPessoa: any): PessoaAssistido {
    return {
      idPessoa: backendPessoa.id,
      nome: backendPessoa.nome || '',
      segundoNome: backendPessoa.segundoNome || '',
      cpf: backendPessoa.cpf || '',
      dataNascimento: backendPessoa.dataNascimento ? new Date(backendPessoa.dataNascimento) : undefined,
      telefone: backendPessoa.telefone || '',
      createdBy: backendPessoa.createdBy,
      creationDate: backendPessoa.creationDate ? new Date(backendPessoa.creationDate) : undefined,
      lastUpdatedBy: backendPessoa.lastUpdatedBy,
      lastUpdateDate: backendPessoa.lastUpdateDate ? new Date(backendPessoa.lastUpdateDate) : undefined,
      endereco: backendPessoa.endereco
    };
  }

  // Mapear Comparecimento do backend
  mapComparecimentoFromBackend(backendComparecimento: any): Comparecimento {
    return {
      idComparecimento: backendComparecimento.idComparecimento,
      data: new Date(backendComparecimento.data),
      flagComparecimento: backendComparecimento.flagComparecimento,
      observacoes: backendComparecimento.observacoes || '',
      createdBy: backendComparecimento.createdBy,
      creationDate: backendComparecimento.creationDate ? new Date(backendComparecimento.creationDate) : undefined,
      lastUpdatedBy: backendComparecimento.lastUpdatedBy,
      lastUpdateDate: backendComparecimento.lastUpdateDate ? new Date(backendComparecimento.lastUpdateDate) : undefined,
      assistido: backendComparecimento.assistido ? this.mapAssistidoFromBackend(backendComparecimento.assistido) : undefined
    };
  }

  // Mapear Usuario do backend
  mapUsuarioFromBackend(backendUsuario: any): Usuario {
    return {
      id: backendUsuario.id || backendUsuario.idUsuario,
      nome: backendUsuario.nome || (backendUsuario.pessoa ? `${backendUsuario.pessoa.nome} ${backendUsuario.pessoa.segundoNome}`.trim() : backendUsuario.nomeUser || 'Nome não disponível'),
      nomeUser: backendUsuario.nomeUser || '',
      email: backendUsuario.email || '',
      senha: backendUsuario.senha,
      perfil: backendUsuario.perfil || 'AGENTE',
      ativo: backendUsuario.ativo !== undefined ? backendUsuario.ativo : true,
      tipoAcesso: backendUsuario.tipoAcesso,
      dataCriacao: backendUsuario.dataCriacao ? new Date(backendUsuario.dataCriacao) : (backendUsuario.creationDate ? new Date(backendUsuario.creationDate) : undefined),
      dataUltimaAtualizacao: backendUsuario.dataUltimaAtualizacao ? new Date(backendUsuario.dataUltimaAtualizacao) : (backendUsuario.lastUpdateDate ? new Date(backendUsuario.lastUpdateDate) : undefined),
      createdBy: backendUsuario.createdBy,
      creationDate: backendUsuario.creationDate ? new Date(backendUsuario.creationDate) : undefined,
      lastUpdatedBy: backendUsuario.lastUpdatedBy,
      lastUpdateDate: backendUsuario.lastUpdateDate ? new Date(backendUsuario.lastUpdateDate) : undefined,
      pessoa: backendUsuario.pessoa ? this.mapPessoaFromBackend(backendUsuario.pessoa) : undefined
    };
  }

  // Mapear Pessoa do backend
  mapPessoaFromBackend(backendPessoa: any): Pessoa {
    return {
      idPessoa: backendPessoa.id,
      nome: backendPessoa.nome || '',
      segundoNome: backendPessoa.segundoNome || '',
      cpf: backendPessoa.cpf || '',
      dataNascimento: backendPessoa.dataNascimento ? new Date(backendPessoa.dataNascimento) : undefined,
      telefone: backendPessoa.telefone || '',
      createdBy: backendPessoa.createdBy,
      creationDate: backendPessoa.creationDate ? new Date(backendPessoa.creationDate) : undefined,
      lastUpdatedBy: backendPessoa.lastUpdatedBy,
      lastUpdateDate: backendPessoa.lastUpdateDate ? new Date(backendPessoa.lastUpdateDate) : undefined,
      endereco: backendPessoa.endereco
    };
  }

  // Mapear Assistido para o backend
  mapAssistidoToBackend(assistido: Assistido): any {
    return {
      id: assistido.id,
      idAssistido: assistido.idAssistido,
      nome: assistido.nome,
      cpf: assistido.cpf,
      numeroProcesso: assistido.numeroProcesso,
      numProcesso: assistido.numProcesso,
      tipoPena: assistido.tipoPena,
      status: assistido.status,
      dataNascimento: assistido.dataNascimento,
      endereco: assistido.endereco,
      telefone: assistido.telefone,
      email: assistido.email,
      observacoes: assistido.observacoes,
      observacao: assistido.observacao,
      dataCadastro: assistido.dataCadastro,
      dataUltimaAtualizacao: assistido.dataUltimaAtualizacao,
      statusComparecimento: assistido.statusComparecimento,
      ultimoComparecimento: assistido.ultimoComparecimento,
      createdBy: assistido.createdBy,
      creationDate: assistido.creationDate,
      lastUpdatedBy: assistido.lastUpdatedBy,
      lastUpdateDate: assistido.lastUpdateDate,
      pessoa: assistido.pessoa ? this.mapPessoaAssistidoToBackend(assistido.pessoa) : undefined,
      comparecimentos: assistido.comparecimentos ? assistido.comparecimentos.map(c => this.mapComparecimentoToBackend(c)) : undefined,
      tipoMonitoramento: assistido.tipoMonitoramento,
      tipoRegime: assistido.tipoRegime,
      tipoSituacao: assistido.tipoSituacao,
      varaExecPenal: assistido.varaExecPenal
    };
  }

  // Mapear PessoaAssistido para o backend
  mapPessoaAssistidoToBackend(pessoa: PessoaAssistido): any {
    return {
      id: pessoa.idPessoa,
      nome: pessoa.nome,
      segundoNome: pessoa.segundoNome,
      cpf: pessoa.cpf,
      dataNascimento: pessoa.dataNascimento,
      telefone: pessoa.telefone,
      createdBy: pessoa.createdBy,
      creationDate: pessoa.creationDate,
      lastUpdatedBy: pessoa.lastUpdatedBy,
      lastUpdateDate: pessoa.lastUpdateDate,
      endereco: pessoa.endereco
    };
  }

  // Mapear Comparecimento para o backend
  mapComparecimentoToBackend(comparecimento: Comparecimento): any {
    return {
      idComparecimento: comparecimento.idComparecimento,
      data: comparecimento.data,
      flagComparecimento: comparecimento.flagComparecimento,
      observacoes: comparecimento.observacoes,
      createdBy: comparecimento.createdBy,
      creationDate: comparecimento.creationDate,
      lastUpdatedBy: comparecimento.lastUpdatedBy,
      lastUpdateDate: comparecimento.lastUpdateDate,
      assistido: comparecimento.assistido ? this.mapAssistidoToBackend(comparecimento.assistido) : undefined
    };
  }

  // Mapear Usuario para o backend
  mapUsuarioToBackend(usuario: Usuario): any {
    return {
      id: usuario.id,
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      nomeUser: usuario.nomeUser,
      email: usuario.email,
      senha: usuario.senha,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      tipoAcesso: usuario.tipoAcesso,
      dataCriacao: usuario.dataCriacao,
      dataUltimaAtualizacao: usuario.dataUltimaAtualizacao,
      createdBy: usuario.createdBy,
      creationDate: usuario.creationDate,
      lastUpdatedBy: usuario.lastUpdatedBy,
      lastUpdateDate: usuario.lastUpdateDate,
      pessoa: usuario.pessoa ? this.mapPessoaToBackend(usuario.pessoa) : undefined
    };
  }

  // Mapear Pessoa para o backend
  mapPessoaToBackend(pessoa: Pessoa): any {
    return {
      id: pessoa.idPessoa,
      nome: pessoa.nome,
      segundoNome: pessoa.segundoNome,
      cpf: pessoa.cpf,
      dataNascimento: pessoa.dataNascimento,
      telefone: pessoa.telefone,
      createdBy: pessoa.createdBy,
      creationDate: pessoa.creationDate,
      lastUpdatedBy: pessoa.lastUpdatedBy,
      lastUpdateDate: pessoa.lastUpdateDate,
      endereco: pessoa.endereco
    };
  }

  // Métodos auxiliares
  private formatarNomeCompleto(assistido: Assistido): string {
    if (assistido.pessoa) {
      return `${assistido.pessoa.nome} ${assistido.pessoa.segundoNome}`.trim();
    }
    return assistido.nome || 'Nome não disponível';
  }

  private formatarNomeCompletoUsuario(usuario: Usuario): string {
    if (usuario.pessoa) {
      return `${usuario.pessoa.nome} ${usuario.pessoa.segundoNome}`.trim();
    }
    return usuario.nome || 'Nome não disponível';
  }

  private formatarEndereco(endereco: any): string {
    if (!endereco) return 'Endereço não informado';
    
    const partes: string[] = [];
    if (endereco.logradouro) partes.push(endereco.logradouro);
    if (endereco.numero) partes.push(endereco.numero);
    if (endereco.complemento) partes.push(endereco.complemento);
    if (endereco.bairro) partes.push(endereco.bairro);
    if (endereco.cidade) partes.push(endereco.cidade);
    if (endereco.estado) partes.push(endereco.estado);
    if (endereco.cep) partes.push(endereco.cep);
    
    return partes.join(', ') || 'Endereço não informado';
  }
}