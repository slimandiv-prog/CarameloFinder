
const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

// Recuperar token de sesión
export const getToken = () => localStorage.getItem("token");

// Verificar si existe una sesión guardada
export const isLoggedIn = () => Boolean(getToken());

// Recuperar usuario autenticado
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// Guardar sesión
function saveSession(token, user) {
  if (!token || !user) {
    throw new Error("Resposta de autenticação inválida.");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Limpiar sesión
function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Enviar peticiones POST
async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Erro na requisição."
    );
  }

  return data;
}

// Registrar usuario
export const register = (data) => post("/auth/register", data);

// Iniciar sesión
export async function login(data) {
  const result = await post("/auth/login", data);

  saveSession(result.token, result.user);

  return result;
}

// Cerrar sesión
export async function logout() {
  const token = getToken();

  try {
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } finally {
    clearSession();
  }
}
