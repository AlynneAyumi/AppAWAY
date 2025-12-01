import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Usuario, PerfilUsuario } from '../models/usuario.model';
import { MapperService } from './mapper.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private mapper: MapperService) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Chamadas reais para o backend
    return this.http.post<any>(`${this.API_URL}/login`, loginRequest).pipe(
      map(backendResponse => {
        try {
          const usuario = this.mapper.mapUsuarioFromBackend(backendResponse.usuario);
          return {
            token: backendResponse.token,
            usuario: usuario,
            expiresIn: backendResponse.expiresIn
          };
        } catch (error) {
          console.error('Erro ao mapear usuário:', error);
          throw error;
        }
      }),
      tap((response: LoginResponse) => {
        localStorage.setItem(environment.auth.tokenStorageKey, response.token);
        localStorage.setItem(environment.auth.userStorageKey, JSON.stringify(response.usuario));
        this.currentUserSubject.next(response.usuario);
      })
    );

    // MODO DESENVOLVIMENTO: Simulação temporária (descomente se necessário para testes sem backend)
    /*
    return new Observable(observer => {
      setTimeout(() => {
        const mockResponse: LoginResponse = {
          token: 'mock-token-12345',
          usuario: {
            id: 1,
            nome: 'Usuário Demo',
            nomeUser: 'usuario.demo',
            email: loginRequest.email,
            perfil: 'ADMINISTRADOR' as PerfilUsuario,
            ativo: true,
            dataCriacao: new Date(),
            dataUltimaAtualizacao: new Date()
          },
          expiresIn: 3600
        };
        
        localStorage.setItem(environment.auth.tokenStorageKey, mockResponse.token);
        localStorage.setItem(environment.auth.userStorageKey, JSON.stringify(mockResponse.usuario));
        this.currentUserSubject.next(mockResponse.usuario);
        
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
    */
  }

  logout(): void {
    localStorage.removeItem(environment.auth.tokenStorageKey);
    localStorage.removeItem(environment.auth.userStorageKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.auth.tokenStorageKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem(environment.auth.userStorageKey);
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
