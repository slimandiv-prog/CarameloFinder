import { useEffect, useState } from "react";
import PetForm, { unpackExtras } from "../components/PetForm";
import "./CadastrarPet.css";

const API_URL = "http://localhost:3000/api";

const formatDate = (d) => (d ? d.split("-").reverse().join("/") : "");

function findToken() {
  const storages = [localStorage, sessionStorage];

  for (const storage of storages) {
    for (const key of ["token", "authToken", "accessToken", "auth_token"]) {
      const value = storage.getItem(key);
      if (value) return value.replace(/^"|"$/g, "");
    }

    for (const key of Object.keys(storage)) {
      const value = (storage.getItem(key) || "").replace(/^"|"$/g, "");
      if (/^[a-f0-9]{64}$/i.test(value)) return value;
    }
  }

  return null;
}

function CadastrarPet({
  pets,
  loading,
  message,
  onAddPet,
  onDeletePet,
  onReload,
  onViewDetails,
}) {
  const [meusPets, setMeusPets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMyPets() {
      try {
        const token = findToken();

        if (!token) throw new Error("Token não encontrado. Faça login novamente.");

        const response = await fetch(`${API_URL}/reports/my-reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Não foi possível carregar os seus registros.");

        setMeusPets(await response.json());
        setError("");
      } catch (err) {
        console.error("Erro ao carregar os meus registros:", err);
        setError(err.message);
      }
    }

    loadMyPets();
  }, [pets]);

  return (
    <main className="app cp-page">
      <section id="cadastrar" className="user-section">
        <PetForm onAddPet={onAddPet} />
      </section>

      {message && <p className="cp-msg" role="status">{message}</p>}

      <div className="cp-titulo">
        <h2>Meus Registros</h2>
        <button className="cp-btn" onClick={onReload}>Atualizar Registros</button>
      </div>

      {loading && <p>Carregando os registros...</p>}
      {error && <p className="cp-erro" role="alert">{error}</p>}

      {!loading && !error && meusPets.length === 0 && (
        <p className="cp-vazio">Você ainda não cadastrou nenhum animal.</p>
      )}

      <div className="cp-lista">
        {!loading &&
          meusPets.map((pet) => (
            <article key={pet.id} className="cp-card">
              <div className="cp-img">
                {pet.image_url ? <img src={pet.image_url} alt={pet.animal_name} /> : <span>🐾</span>}
              </div>

              <h3>{pet.animal_name}</h3>

              <div>
                <span className={`cp-tag ${pet.animal_type === "lost" ? "perdido" : "encontrado"}`}>
                  {pet.animal_type === "lost" ? "Perdido" : "Encontrado"}
                </span>
                <span className={`cp-tag ${pet.status === "resolved" ? "resolvido" : ""}`}>
                  {pet.status === "active" ? "Ativo" : "Resolvido"}
                </span>
              </div>

              {unpackExtras(pet.description).age && <p>Idade: {unpackExtras(pet.description).age}</p>}
              {unpackExtras(pet.description).sex && (
                <p>Sexo: {unpackExtras(pet.description).sex === "male" ? "Macho" : "Fêmea"}</p>
              )}
              <p>Localização: {pet.location}</p>
              <p>Data: {formatDate(pet.report_date)}</p>

              <div className="cp-acoes">
                <button className="cp-btn-sec" onClick={() => onViewDetails(pet.id)}>Ver Detalhes</button>
                <button className="cp-btn-sec perigo" onClick={() => onDeletePet(pet.id)}>Excluir</button>
              </div>
            </article>
          ))}
      </div>
    </main>
  );
}

export default CadastrarPet;