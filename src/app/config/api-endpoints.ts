/**
 * Configuração centralizada dos endpoints da API
 * Ajuste estes valores conforme a estrutura do seu backend
 */
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },

  // Assistidos
  ASSISTIDO: {
    BASE: '/assistido',
    FIND_ALL: '/assistido/findAll',
    FIND_BY_ID: '/assistido/findById',
    FIND_BY_CPF: '/assistido/findByCpf',
    FIND_BY_NUMERO_PROCESSO: '/assistido/numProcesso',
    SAVE: '/assistido/save',
    UPDATE: '/assistido/update',
    DELETE: '/assistido/delete'
  },

  // Comparecimentos
  COMPARECIMENTO: {
    BASE: '/comparecimento',
    FIND_ALL: '/comparecimento/findAll',
    FIND_BY_ID: '/comparecimento/findById',
    SAVE: '/comparecimento/save',
    UPDATE: '/comparecimento/update',
    DELETE: '/comparecimento/delete',
    CONFIRMAR: '/comparecimento/confirmar',
    REGISTRAR_FALTA: '/comparecimento/registrarFalta'
  },

  // Usuários
  USUARIO: {
    BASE: '/usuario',
    FIND_ALL: '/usuario/findAll',
    FIND_BY_ID: '/usuario/findById',
    SAVE: '/usuario/save',
    UPDATE: '/usuario/update',
    DELETE: '/usuario/delete'
  },

  // Documentos
  DOCUMENTO: {
    BASE: '/documento',
    FIND_ALL: '/documento/findAll',
    FIND_BY_ID: '/documento/findById',
    UPLOAD: '/documento/upload',
    DOWNLOAD: '/documento/download',
    DELETE: '/documento/delete'
  },

};

/**
 * Tipos de operações HTTP suportadas
 */
export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

/**
 * Códigos de status HTTP mais comuns
 */
export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}
