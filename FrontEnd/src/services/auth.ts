import { saveAuthToken, saveClientData, clearAuthData } from "@/lib/authUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  cliente: {
    id: string;
    nomeCompleto: string;
    email: string;
    prioridade: string;
  };
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nomeCompleto: string;
  idade: number;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  enderecoCompleto: string;
  contatoEmergenciaNome?: string;
  contatoEmergenciaTelefone?: string;
  mobilidade: {
    condicaoMobilidade?: string;
    tipoSanguineo?: string;
    necessitaAcompanhante: boolean;
    transporteExclusivoEmMaca: boolean;
    usoContínuoDeOxigenio: boolean;
    pacienteBeriatrico: boolean;
  };
  dadosClinicos: {
    cartaoSus?: string;
    alergias?: string;
    medicamentosUsoContinuo?: string;
    comorbidades?: string;
    tratamentoOncologico: boolean;
    quimioterapiaOuRadioterapia: boolean;
    doencaPulmonarCronicaDpoc: boolean;
    posOperatorioRecente: boolean;
    hemodialise: boolean;
    cardiopatiaGrave: boolean;
    gestacaoAltoRisco: boolean;
    cuidadosPaliativos: boolean;
  };
  senha: string;
  confirmarSenha: string;
  aceitouTermos: boolean;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      senha: data.senha,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.erro || "Erro ao fazer login");
  }

  const result = await response.json();
  
  // Salvar token usando o utilitário
  if (result.accessToken) {
    saveAuthToken(result.accessToken, result.expiresIn);
    saveClientData(result.cliente);
  }
  
  return result;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.erro || "Erro ao realizar cadastro");
  }

  const result = await response.json();
  
  // NÃO salvar token após cadastro - usuário deve fazer login manualmente
  // O token será vazio durante o registro e não fazemos login automático
  
  return result;
};

export const logout = () => {
  // Usar o utilitário para limpar todos os dados
  clearAuthData();
};
