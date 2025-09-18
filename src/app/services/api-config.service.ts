import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  constructor() { }

  /**
   * Retorna a URL base da API
   */
  getApiUrl(): string {
    return environment.apiUrl;
  }

  /**
   * Retorna a URL completa para um endpoint específico
   */
  getEndpointUrl(endpoint: string): string {
    return `${this.getApiUrl()}/${endpoint.replace(/^\//, '')}`;
  }

  /**
   * Retorna as configurações de autenticação
   */
  getAuthConfig() {
    return environment.auth;
  }

  /**
   * Verifica se a aplicação está em modo de produção
   */
  isProduction(): boolean {
    return environment.production;
  }

  /**
   * Retorna headers padrão para requisições
   */
  getDefaultHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Retorna headers com autorização
   */
  getAuthHeaders(token: string): { [key: string]: string } {
    return {
      ...this.getDefaultHeaders(),
      'Authorization': `${environment.auth.tokenPrefix}${token}`
    };
  }
}
