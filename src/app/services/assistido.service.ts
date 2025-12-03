import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Assistido, AssistidoFiltro } from '../models/assistido.model';
import { MapperService } from './mapper.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssistidoService {
  private readonly API_URL = `${environment.apiUrl}/assistido`;

  constructor(private http: HttpClient, private mapper: MapperService) { }

  listar(filtro?: AssistidoFiltro): Observable<any> {
    return this.http.get<any[]>(`${this.API_URL}/findAll`).pipe(
      map(backendAssistidos => {
        let assistidos = backendAssistidos.map(assistido => this.mapper.mapAssistidoFromBackend(assistido));
        
        // Aplicar filtros no frontend
        if (filtro) {
          assistidos = this.aplicarFiltros(assistidos, filtro);
        }
        
        // Paginação
        const page = filtro?.page || 0;
        const size = filtro?.size || 10;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedAssistidos = assistidos.slice(startIndex, endIndex);
        
        return {
          content: paginatedAssistidos,
          totalElements: assistidos.length,
          totalPages: Math.ceil(assistidos.length / size),
          number: page,
          size: size,
          first: page === 0,
          last: page >= Math.ceil(assistidos.length / size) - 1
        };
      })
    );
  }

  private aplicarFiltros(assistidos: Assistido[], filtro: AssistidoFiltro): Assistido[] {
    const termoBusca = filtro.nome?.toLowerCase().trim() || '';

    if (!termoBusca) {
      return assistidos; // Se não há termo de busca, retorna todos os assistidos
    }

    return assistidos.filter(assistido => {
      const nomeCompleto = assistido.nome || `${assistido.pessoa?.nome || ''} ${assistido.pessoa?.segundoNome || ''}`.trim();
      const cpfAssistido = (assistido.cpf || assistido.pessoa?.cpf || '').replace(/\D/g, '');
      const numProcesso = assistido.numeroProcesso || '';
      
      const encontrouNoNome = nomeCompleto.toLowerCase().includes(termoBusca);
      const encontrouNoCpf = cpfAssistido.includes(termoBusca.replace(/\D/g, ''));
      const encontrouNoProcesso = numProcesso.toLowerCase().includes(termoBusca);
      
      return encontrouNoNome || encontrouNoCpf || encontrouNoProcesso;
    });
  }

  buscarPorId(id: number): Observable<Assistido> {
    return this.http.get<any>(`${this.API_URL}/findById/${id}`).pipe(
      map(backendAssistido => this.mapper.mapAssistidoFromBackend(backendAssistido))
    );
  }

  criar(assistido: any): Observable<Assistido> {
    // O componente já envia no formato correto (AssistidoCreateRequest)
    // Apenas garantir que os campos estão mapeados corretamente
    const createRequest = {
      numAuto: assistido.numAuto || '',
      numProcesso: assistido.numProcesso || '',
      observacao: assistido.observacao || '',
      pessoa: {
        nome: assistido.pessoa?.nome || '',
        segundoNome: assistido.pessoa?.segundoNome || '',
        cpf: assistido.pessoa?.cpf || '',
        dataNascimento: assistido.pessoa?.dataNascimento || '',
        telefone: assistido.pessoa?.telefone || '',
        endereco: {
          logradouro: assistido.pessoa?.endereco?.logradouro || ''
        }
      }
    };
    
    return this.http.post<any>(`${this.API_URL}/save`, createRequest).pipe(
      map(response => {
        // O backend agora retorna JSON estruturado
        if (response.success) {
          return {
            id: response.id,
            idAssistido: response.id,
            nome: createRequest.pessoa.nome,
            numProcesso: createRequest.numProcesso,
            observacao: createRequest.observacao,
            pessoa: {
              idPessoa: Date.now(),
              nome: createRequest.pessoa.nome,
              segundoNome: createRequest.pessoa.segundoNome,
              cpf: createRequest.pessoa.cpf,
              dataNascimento: createRequest.pessoa.dataNascimento,
              telefone: createRequest.pessoa.telefone,
              endereco: {
                idEndereco: Date.now(),
                logradouro: createRequest.pessoa.endereco.logradouro
              }
            }
          } as Assistido;
        } else {
          throw new Error(response.message || 'Erro desconhecido');
        }
      })
    );
  }

  atualizar(id: number, assistido: any): Observable<Assistido> {
    const updateRequest = {
      numAuto: assistido.numAuto || '',
      numProcesso: assistido.numProcesso || '',
      observacao: assistido.observacao || '',
      pessoa: {
        idPessoa: assistido.pessoa?.idPessoa,
        nome: assistido.pessoa?.nome || '',
        segundoNome: assistido.pessoa?.segundoNome || '',
        cpf: assistido.pessoa?.cpf || '',
        dataNascimento: assistido.pessoa?.dataNascimento || '',
        telefone: assistido.pessoa?.telefone || '',
        endereco: {
          idEndereco: assistido.pessoa?.endereco?.idEndereco,
          logradouro: assistido.pessoa?.endereco?.logradouro || '',
          cep: assistido.pessoa?.endereco?.cep || '00000-000',
          bairro: assistido.pessoa?.endereco?.bairro || 'A definir',
          cidade: assistido.pessoa?.endereco?.cidade || 'A definir',
          estado: assistido.pessoa?.endereco?.estado || 'A definir',
          numero: assistido.pessoa?.endereco?.numero || 0
        }
      }
    };

    return this.http.put<any>(`${this.API_URL}/update/${id}`, updateRequest).pipe(
      map(response => {
        if (response.success) {
          return {
            id: response.id,
            idAssistido: response.id,
            nome: updateRequest.pessoa.nome,
            numProcesso: updateRequest.numProcesso,
            observacao: updateRequest.observacao,
            pessoa: {
              idPessoa: updateRequest.pessoa.idPessoa || Date.now(),
              nome: updateRequest.pessoa.nome,
              segundoNome: updateRequest.pessoa.segundoNome,
              cpf: updateRequest.pessoa.cpf,
              dataNascimento: updateRequest.pessoa.dataNascimento,
              telefone: updateRequest.pessoa.telefone,
              endereco: {
                idEndereco: updateRequest.pessoa.endereco.idEndereco || Date.now(),
                logradouro: updateRequest.pessoa.endereco.logradouro,
                cep: updateRequest.pessoa.endereco.cep,
                bairro: updateRequest.pessoa.endereco.bairro,
                cidade: updateRequest.pessoa.endereco.cidade,
                estado: updateRequest.pessoa.endereco.estado,
                numero: updateRequest.pessoa.endereco.numero
              }
            }
          } as Assistido;
        } else {
          throw new Error(response.message || 'Erro desconhecido');
        }
      })
    );
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/delete/${id}`).pipe(
      map(response => {
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || 'Erro ao excluir assistido');
        }
      })
    );
  }

  buscarPorCpf(cpf: string): Observable<Assistido> {
    // O backend atual não tem endpoint específico para CPF
    // Retorna todos e filtra no frontend por enquanto
    return this.http.get<Assistido>(`${this.API_URL}/findAll`);
  }

  buscarPorNumeroProcesso(numeroProcesso: string): Observable<Assistido> {
    return this.http.get<any[]>(`${this.API_URL}/numProcesso?numProcesso=${numeroProcesso}`).pipe(
      map(backendAssistidos => {
        if (backendAssistidos && backendAssistidos.length > 0) {
          return this.mapper.mapAssistidoFromBackend(backendAssistidos[0]);
        }
        throw new Error('Assistido não encontrado');
      })
    );
  }
}
