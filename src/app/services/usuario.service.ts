import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario, PerfilUsuario, UsuarioFiltro } from '../models/usuario.model';
import { MapperService } from './mapper.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient, private mapper: MapperService) { }

  listar(filtro?: UsuarioFiltro): Observable<any> {
    let params = new HttpParams();
    
    if (filtro?.nome) {
      params = params.set('nome', filtro.nome);
    }
    if (filtro?.email) {
      params = params.set('email', filtro.email);
    }
    if (filtro?.perfil) {
      params = params.set('perfil', filtro.perfil);
    }
    if (filtro?.ativo !== undefined) {
      params = params.set('ativo', filtro.ativo.toString());
    }
    if (filtro?.page !== undefined) {
      params = params.set('page', filtro.page.toString());
    }
    if (filtro?.size !== undefined) {
      params = params.set('size', filtro.size.toString());
    }

    return this.http.get<any[]>(`${this.API_URL}/findAll`, { params }).pipe(
      map(backendUsuarios => {
        const usuarios = backendUsuarios.map(usuario => this.mapper.mapUsuarioFromBackend(usuario));
        return {
          content: usuarios,
          totalElements: usuarios.length,
          totalPages: 1,
          number: 0,
          size: usuarios.length,
          first: true,
          last: true
        };
      })
    );
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<any>(`${this.API_URL}/findById/${id}`).pipe(
      map(backendUsuario => this.mapper.mapUsuarioFromBackend(backendUsuario))
    );
  }

  criar(usuario: Usuario): Observable<Usuario> {
    const backendUsuario = this.mapper.mapUsuarioToBackend(usuario);
    return this.http.post<any>(`${this.API_URL}/save`, backendUsuario, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(backendResponse => {
        return this.mapper.mapUsuarioFromBackend(backendResponse);
      })
    );
  }

  atualizar(id: number, usuario: Usuario): Observable<Usuario> {
    const backendUsuario = this.mapper.mapUsuarioToBackend(usuario);
    return this.http.put<any>(`${this.API_URL}/update/${id}`, backendUsuario, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(backendResponse => this.mapper.mapUsuarioFromBackend(backendResponse))
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }
}
