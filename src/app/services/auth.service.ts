import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
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
    return this.http.post<any>(`${this.API_URL}/login`, loginRequest).pipe(
      map(backendResponse => ({
        token: backendResponse.token,
        expiresIn: backendResponse.expiresIn
      })),
      tap(response => {
        this.setCookie(
          environment.auth.tokenStorageKey,
          response.token,
          response.expiresIn
        );
      }),
      switchMap(response =>
        this.http.get<any>(`${this.API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${response.token}`
          }
        }).pipe(
          tap(user => {
            this.setCookie(
              environment.auth.userStorageKey,
              JSON.stringify(user),
              response.expiresIn
            );
            this.currentUserSubject.next(user);
          }),
          map(user => ({ ...response, usuario: user }))
        )
      )
    );
  }


  private setCookie(name: string, value: string, expiresInSeconds: number): void {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiresInSeconds);

    document.cookie = [
      `${name}=${value}`,
      `expires=${expires.toUTCString()}`,
      `path=/`,
      `SameSite=Strict`,
      `Secure`
    ].join('; ');
  } 

  getToken(): string | null {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(cookie => cookie.trim().startsWith(`${environment.auth.tokenStorageKey}=`));

    return cookie 
      ? cookie.split('=')[1].trim()
      : null;
  }

  logout(): void {
    const expired = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `${environment.auth.tokenStorageKey}=; ${expired}`;
    document.cookie = `${environment.auth.userStorageKey}=; ${expired}`;
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(c => c.trim().startsWith(`${environment.auth.userStorageKey}=`));
    if (cookie) {
      const value = cookie.split('=').slice(1).join('=').trim();
      this.currentUserSubject.next(JSON.parse(decodeURIComponent(value)));
    }
  }
}
