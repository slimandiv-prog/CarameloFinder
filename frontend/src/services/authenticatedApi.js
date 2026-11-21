
import { getToken } from "./auth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

const REPORTS_URL = `${API_URL}/reports`;

// Limpar sessão quando o token expirar.
function handleSessionExpired() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("auth:expired"));
}

// Realizar requisições que exigem autenticação.
export async function authenticatedFetch(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Você precisa fazer login.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    handleSessionExpired();

    throw new Error(
      data?.message ||
      "Sua sessão expirou. Faça login novamente."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Erro na requisição."
    );
  }

  return data;
}

// Criar um novo registro.
export const createAuthenticatedPet = (pet) =>
  authenticatedFetch(REPORTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

// Atualizar um registro.
export const updateAuthenticatedPet = (id, pet) =>
  authenticatedFetch(`${REPORTS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

// Excluir um registro.
export const deleteAuthenticatedPet = (id) =>
  authenticatedFetch(`${REPORTS_URL}/${id}`, {
    method: "DELETE",
  });
