import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Comparecimento, ComparecimentoFiltro } from '../models/assistido.model';
import { MapperService } from './mapper.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComparecimentoService {
  private readonly API_URL = `${environment.apiUrl}/comparecimento`;

  constructor(private http: HttpClient, private mapper: MapperService) { }

  listar(filtro?: ComparecimentoFiltro): Observable<any> {
    // O backend atual não suporta filtros para comparecimentos
    // Retorna todos os comparecimentos
    return this.http.get<any[]>(`${this.API_URL}/findAll`).pipe(
      map(backendComparecimentos => {
        const comparecimentos = backendComparecimentos.map(comparecimento => this.mapper.mapComparecimentoFromBackend(comparecimento));
        return {
          content: comparecimentos,
          totalElements: comparecimentos.length,
          totalPages: 1,
          number: 0,
          size: comparecimentos.length,
          first: true,
          last: true
        };
      })
    );
  }

  buscarPorId(id: number): Observable<Comparecimento> {
    return this.http.get<any>(`${this.API_URL}/findById/${id}`).pipe(
      map(backendComparecimento => this.mapper.mapComparecimentoFromBackend(backendComparecimento))
    );
  }

  criar(comparecimento: Comparecimento): Observable<Comparecimento> {
    const backendComparecimento = this.mapper.mapComparecimentoToBackend(comparecimento);
    return this.http.post<any>(`${this.API_URL}/save`, backendComparecimento).pipe(
      map(backendResponse => this.mapper.mapComparecimentoFromBackend(backendResponse))
    );
  }

  atualizar(id: number, comparecimento: Comparecimento): Observable<Comparecimento> {
    const backendComparecimento = this.mapper.mapComparecimentoToBackend(comparecimento);
    return this.http.put<any>(`${this.API_URL}/update/${id}`, backendComparecimento).pipe(
      map(backendResponse => this.mapper.mapComparecimentoFromBackend(backendResponse))
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  confirmar(id: number): Observable<Comparecimento> {
    return this.http.patch<Comparecimento>(`${this.API_URL}/update/${id}`, { 
      flagComparecimento: true 
    });
  }

  registrarFalta(id: number): Observable<Comparecimento> {
    return this.http.patch<Comparecimento>(`${this.API_URL}/update/${id}`, { 
      flagComparecimento: false 
    });
  }
}
