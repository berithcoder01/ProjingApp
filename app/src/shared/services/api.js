// Detecta ambiente nativo (Capacitor/Android/iOS)
const isNative = typeof window !== 'undefined' && 
  (!!window.Capacitor || window.location.protocol === 'file:' || window.location.protocol === 'capacitor:');

// URL base da API no Vercel (Atualizado conforme log de deploy)
const API_BASE = 'https://project-w0uug.vercel.app';

// Se for nativo, usa URL absoluta. Se for web, usa /api (proxy ou rewrite)
const API_URL = isNative ? `${API_BASE}/api` : '/api';

console.log('Ambiente:', isNative ? 'Nativo' : 'Web');
console.log('API_URL sendo usada:', API_URL);



const getAuthHeaders = () => {
  const token = localStorage.getItem('@orcaai:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  let data;
  const rawText = await response.text();
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`Erro API: ${response.status}. Retorno: ${rawText.substring(0, 50)}...`);
  }

  if (!response.ok) throw new Error(data.error || 'Credenciais inválidas');
  return data;
};

export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar conta');
  }
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Não autenticado');
  return response.json();
};


export const fetchCatalog = async () => {
  const response = await fetch(`${API_URL}/catalog`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Falha ao buscar catálogo');
  return response.json();
};

export const saveProposal = async (proposalData) => {
  const response = await fetch(`${API_URL}/proposals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(proposalData),
  });
  if (!response.ok) throw new Error('Falha ao salvar proposta');
  return response.json();
};

export const fetchProposals = async () => {
  const response = await fetch(`${API_URL}/proposals`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar propostas');
  return response.json();
};

export const fetchProposalById = async (id) => {
  const response = await fetch(`${API_URL}/proposals/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar detalhes da proposta');
  return response.json();
};

export const updateProposal = async (id, proposalData) => {
  const response = await fetch(`${API_URL}/proposals/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(proposalData),
  });
  if (!response.ok) throw new Error('Falha ao atualizar proposta');
  return response.json();
};

export const updateProposalStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/proposals/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Falha ao atualizar status');
  return response.json();
};

export const deleteProposal = async (id) => {
  const response = await fetch(`${API_URL}/proposals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Falha ao excluir proposta');
  return true;
};

export const duplicateProposal = async (id) => {
  const response = await fetch(`${API_URL}/proposals/${id}/duplicate`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Falha ao duplicar proposta');
  return response.json();
};


export const fetchClients = async () => {
  const response = await fetch(`${API_URL}/clients`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar clientes');
  return response.json();
};

export const createClient = async (clientData) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error('Falha ao criar cliente');
  return response.json();
};

export const deleteClient = async (id) => {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Falha ao deletar cliente');
  return true;
};

export const fetchStats = async () => {
  const response = await fetch(`${API_URL}/dashboard/stats`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar estatísticas');
  return response.json();
};

export const fetchRecentProposals = async () => {
  const response = await fetch(`${API_URL}/dashboard/recent`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar propostas recentes');
  return response.json();
};

export const fetchSettings = async () => {
  const response = await fetch(`${API_URL}/settings`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar configurações');
  return response.json();
};

export const updateSettings = async (settingsData) => {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settingsData)
  });
  if (!response.ok) throw new Error('Falha ao atualizar configurações');
  return response.json();
};

