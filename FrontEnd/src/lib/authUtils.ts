/**
 * Utilitários para gerenciar tokens de autenticação
 */

const AUTH_TOKEN_KEY = "authToken";
const TOKEN_EXPIRY_KEY = "tokenExpiry";
const CLIENT_DATA_KEY = "clientData";

export interface StoredClientData {
  id: string;
  nomeCompleto: string;
  email: string;
  prioridade: string;
}

/**
 * Salvar token de autenticação
 */
export const saveAuthToken = (token: string, expiresIn: number): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
};

/**
 * Obter token de autenticação
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Verificar se o token é válido (não expirado)
 */
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return false;

  return Date.now() < parseInt(expiry);
};

/**
 * Salvar dados do cliente
 */
export const saveClientData = (clientData: StoredClientData): void => {
  localStorage.setItem(CLIENT_DATA_KEY, JSON.stringify(clientData));
};

/**
 * Obter dados do cliente
 */
export const getClientData = (): StoredClientData | null => {
  const data = localStorage.getItem(CLIENT_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Limpar dados de autenticação
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(CLIENT_DATA_KEY);
};

/**
 * Obter headers de autorização
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

/**
 * Verificar se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null && isTokenValid();
};
