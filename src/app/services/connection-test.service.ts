import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  endpoint: string;
  responseTime?: number;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionTestService {

  constructor(private http: HttpClient) { }

  /**
   * Testa a conexão básica com o backend
   */
  testBasicConnection(): Observable<ConnectionTestResult> {
    const startTime = Date.now();
    const endpoint = `${environment.apiUrl}/health`;

    return this.http.get(endpoint).pipe(
      map(() => ({
        success: true,
        message: 'Conexão com backend estabelecida com sucesso!',
        endpoint,
        responseTime: Date.now() - startTime
      })),
      catchError(error => of({
        success: false,
        message: `Erro ao conectar com o backend: ${error.message}`,
        endpoint,
        responseTime: Date.now() - startTime,
        error
      }))
    );
  }

  /**
   * Testa os endpoints principais da API
   */
  testMainEndpoints(): Observable<ConnectionTestResult[]> {
    const endpoints = [
      '/auth/login',
      '/assistido/findAll',
      '/comparecimento/findAll'
    ];

    const tests = endpoints.map(endpoint => 
      this.testEndpoint(endpoint)
    );

    return new Observable(observer => {
      Promise.all(tests.map(test => test.toPromise()))
        .then(results => {
          observer.next(results as ConnectionTestResult[]);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   * Testa um endpoint específico
   */
  private testEndpoint(endpoint: string): Observable<ConnectionTestResult> {
    const startTime = Date.now();
    const fullUrl = `${environment.apiUrl}${endpoint}`;

    return this.http.get(fullUrl).pipe(
      map(() => ({
        success: true,
        message: `Endpoint ${endpoint} está acessível`,
        endpoint: fullUrl,
        responseTime: Date.now() - startTime
      })),
      catchError(error => of({
        success: false,
        message: `Endpoint ${endpoint} não está acessível: ${error.status} ${error.statusText}`,
        endpoint: fullUrl,
        responseTime: Date.now() - startTime,
        error: {
          status: error.status,
          statusText: error.statusText,
          message: error.message
        }
      }))
    );
  }

  /**
   * Retorna informações sobre a configuração atual
   */
  getConfigInfo(): any {
    return {
      apiUrl: environment.apiUrl,
      production: environment.production,
      authConfig: environment.auth,
      timestamp: new Date().toISOString()
    };
  }
}
