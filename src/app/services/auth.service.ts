import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Usuario, PerfilUsuario } from '../models/usuario.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private mapper: MapperService) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Simulação temporária para demonstração - REMOVER quando backend estiver disponível
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
        
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.usuario));
        this.currentUserSubject.next(mockResponse.usuario);
        
        observer.next(mockResponse);
        observer.complete();
      }, 1000); // Simula delay de rede
    });
    
    // Código original comentado - descomente quando backend estiver disponível
    /*
    return this.http.post<any>(`${this.API_URL}/login`, loginRequest).pipe(
      map(backendResponse => {
        const usuario = this.mapper.mapUsuarioFromBackend(backendResponse.usuario);
        return {
          token: backendResponse.token,
          usuario: usuario,
          expiresIn: backendResponse.expiresIn
        };
      }),
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.usuario));
        this.currentUserSubject.next(response.usuario);
      })
    );
    */
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
