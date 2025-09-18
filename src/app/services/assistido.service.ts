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
    // O backend atual não suporta filtros, retorna todos os assistidos
    return this.http.get<any[]>(`${this.API_URL}/findAll`).pipe(
      map(backendAssistidos => {
        const assistidos = backendAssistidos.map(assistido => this.mapper.mapAssistidoFromBackend(assistido));
        return {
          content: assistidos,
          totalElements: assistidos.length,
          totalPages: 1,
          number: 0,
          size: assistidos.length,
          first: true,
          last: true
        };
      })
    );
  }

  buscarPorId(id: number): Observable<Assistido> {
    return this.http.get<any>(`${this.API_URL}/findById/${id}`).pipe(
      map(backendAssistido => this.mapper.mapAssistidoFromBackend(backendAssistido))
    );
  }

  criar(assistido: Assistido): Observable<Assistido> {
    const backendAssistido = this.mapper.mapAssistidoToBackend(assistido);
    return this.http.post<any>(`${this.API_URL}/save`, backendAssistido).pipe(
      map(backendResponse => this.mapper.mapAssistidoFromBackend(backendResponse))
    );
  }

  atualizar(id: number, assistido: Assistido): Observable<Assistido> {
    const backendAssistido = this.mapper.mapAssistidoToBackend(assistido);
    return this.http.put<any>(`${this.API_URL}/update/${id}`, backendAssistido).pipe(
      map(backendResponse => this.mapper.mapAssistidoFromBackend(backendResponse))
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
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
