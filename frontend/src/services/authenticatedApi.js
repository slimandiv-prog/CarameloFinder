import { getToken } from "./auth";

const API_URL = "http://localhost:3000/api/reports";

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

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Erro na requisição."
    );
  }

  return data;
}

export const createAuthenticatedPet = (pet) =>
  authenticatedFetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pet),
  });

export const updateAuthenticatedPet = (id, pet) =>
  authenticatedFetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pet),
  });

export const deleteAuthenticatedPet = (id) =>
  authenticatedFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });