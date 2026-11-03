const API_URL = "http://localhost:3000/api/reports";

export async function getPets() {
const response = await fetch(API_URL);

if (!response.ok) {
throw new Error("Não foi possível carregar os registros.");
}


return response.json();
}

export async function getPetById(id) {
const response = await fetch(`${API_URL}/${id}`);

if (!response.ok) {
throw new Error("Registro não encontrado.");
}

return response.json();
}

export async function createPet(pet) {
const response = await fetch(API_URL, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(pet),
});

if (!response.ok) {
throw new Error("Não foi possível cadastrar o registro.");
}

return response.json();
}

export async function updatePet(id, pet) {
const response = await fetch(`${API_URL}/${id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(pet),
});

if (!response.ok) {
throw new Error("Não foi possível atualizar o registro.");
}

return response.json();
}

export async function deletePet(id) {
const response = await fetch(`${API_URL}/${id}`, {
method: "DELETE",
});

if (!response.ok) {
throw new Error("FNão foi possível excluir o registro.");
}

return response.json();
}
