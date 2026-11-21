
import { authenticatedFetch } from "./authenticatedApi";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

const REPORTS_URL = `${API_URL}/reports`;

// Consultar todos los reportes (público)
export async function getPets() {
  const response = await fetch(REPORTS_URL);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os registros.");
  }

  return response.json();
}

// Consultar un reporte por ID (público)
export async function getPetById(id) {
  const response = await fetch(`${REPORTS_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Registro não encontrado.");
  }

  return response.json();
}

// Crear un reporte (autenticado)
export async function createPet(pet) {
  return authenticatedFetch(REPORTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });
}

// Actualizar un reporte (autenticado)
export async function updatePet(id, pet) {
  return authenticatedFetch(`${REPORTS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });
}

// Eliminar un reporte (autenticado)
export async function deletePet(id) {
  return authenticatedFetch(`${REPORTS_URL}/${id}`, {
    method: "DELETE",
  });
}
