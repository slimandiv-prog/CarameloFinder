const BASE_URL = "http://localhost:3000/api";

export const getToken = () => localStorage.getItem("token");

export const isLoggedIn = () => Boolean(getToken());

export function getUser() {
try {
return JSON.parse(localStorage.getItem("user"));
} catch {
return null;
}
}

function saveSession(token, user) {
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));
}

function clearSession() {
localStorage.removeItem("token");
localStorage.removeItem("user");
}

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
throw new Error(data?.message || "Erro na requisição.");
}

return data;
}

export const register = (data) => post("/auth/register", data);

export async function login(data) {
const result = await post("/auth/login", data);

saveSession(result.token, result.user);

return result;
}
export async function logout() {
try {
const token = getToken();


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
