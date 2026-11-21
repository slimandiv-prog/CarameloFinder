
import { useCallback, useEffect, useState } from "react";

import PetForm, { unpackExtras } from "../components/PetForm";
import { getToken, logout } from "../services/auth";

import "./CadastrarPet.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

const formatDate = (date) => {
  if (!date) return "Não informada";

  return date.split("-").reverse().join("/");
};

const speciesLabels = {
  dog: "Cachorro",
  cat: "Gato",
  other: "Outro",
};

const sexLabels = {
  male: "Macho",
  female: "Fêmea",
};

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
  const [loadingMyPets, setLoadingMyPets] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Carregar registros do usuário autenticado.
  const loadMyPets = useCallback(async () => {
    try {
      setLoadingMyPets(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Sessão não encontrada. Faça login novamente."
        );
      }

      const response = await fetch(
        `${API_URL}/reports/my-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        await logout();
        throw new Error(
          "Sua sessão expirou. Faça login novamente."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar os seus registros."
        );
      }

      const data = await response.json();

      setMeusPets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Erro ao carregar os meus registros:",
        err
      );

      setError(err.message);
      setMeusPets([]);
    } finally {
      setLoadingMyPets(false);
    }
  }, []);

  // Atualizar quando os registros gerais forem modificados.
  useEffect(() => {
    loadMyPets();
  }, [loadMyPets, pets]);

  // Cadastrar animal e atualizar a lista.
  async function handleAdd(pet) {
    await onAddPet(pet);
    await loadMyPets();
  }

  // Excluir animal e atualizar a lista.
  async function handleDelete(id) {
    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir este registro?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await onDeletePet(id);
      await loadMyPets();
    } catch (err) {
      console.error("Erro ao excluir o registro:", err);
      setError(
        err.message || "Não foi possível excluir o registro."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="app cp-page">
      {/* FORMULARIO */}
      <section id="cadastrar" className="user-section">
        <PetForm onAddPet={handleAdd} />
      </section>

      {message && (
        <p className="cp-msg" role="status">
          {message}
        </p>
      )}

      {/* TITULO E ACAO */}
      <div className="cp-titulo">
        <h2>Meus Registros</h2>

        <button
          className="cp-btn"
          type="button"
          onClick={() => {
            onReload?.();
            loadMyPets();
          }}
          disabled={loadingMyPets}
        >
          {loadingMyPets
            ? "Atualizando..."
            : "Atualizar Registros"}
        </button>
      </div>

      {loading && (
        <p>Carregando os registros...</p>
      )}

      {error && (
        <p className="cp-erro" role="alert">
          {error}
        </p>
      )}

      {loadingMyPets && (
        <p>Carregando seus registros...</p>
      )}

      {!loadingMyPets &&
        !error &&
        meusPets.length === 0 && (
          <p className="cp-vazio">
            Você ainda não cadastrou nenhum animal.
          </p>
        )}

      {/* LISTA DE REGISTROS */}
      <div className="cp-lista">
        {!loadingMyPets &&
          !error &&
          meusPets.map((pet) => {
            const extras = unpackExtras(
              pet.description || ""
            );

            const isResolved = pet.status === "resolved";

            return (
              <article key={pet.id} className="cp-card">
                <div className="cp-img">
                  {pet.image_url ? (
                    <img
                      src={pet.image_url}
                      alt={`Foto de ${pet.animal_name}`}
                    />
                  ) : (
                    <span>🐾</span>
                  )}
                </div>

                <h3>
                  {pet.animal_name || "Animal sem nome"}
                </h3>

                {/* ESPECIE */}
                <p>
                  <strong>Tipo de Animal:</strong>{" "}
                  {speciesLabels[extras.species] ||
                    "Não informado"}
                </p>

                {/* SITUACAO */}
                <div>
                  <span
                    className={`cp-tag ${
                      pet.animal_type === "lost"
                        ? "perdido"
                        : "encontrado"
                    }`}
                  >
                    {pet.animal_type === "lost"
                      ? "Perdido"
                      : "Encontrado"}
                  </span>

                  <span
                    className={`cp-tag ${
                      isResolved ? "resolvido" : ""
                    }`}
                  >
                    {isResolved ? "Resolvido" : "Ativo"}
                  </span>
                </div>

                {/* IDADE */}
                <p>
                  <strong>Idade:</strong>{" "}
                  {extras.age || "Não informada"}
                </p>

                {/* SEXO */}
                <p>
                  <strong>Sexo:</strong>{" "}
                  {sexLabels[extras.sex] || "Não informado"}
                </p>

                <p>
                  <strong>Localização:</strong>{" "}
                  {pet.location || "Não informada"}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {formatDate(pet.report_date)}
                </p>

                {/* ACOES */}
                <div className="cp-acoes">
                  <button
                    className="cp-btn-sec"
                    type="button"
                    onClick={() => onViewDetails?.(pet.id)}
                  >
                    Ver Detalhes
                  </button>

                  <button
                    className="cp-btn-sec perigo"
                    type="button"
                    onClick={() => handleDelete(pet.id)}
                    disabled={deletingId !== null}
                  >
                    {deletingId === pet.id
                      ? "Excluindo..."
                      : "Excluir"}
                  </button>
                </div>
              </article>
            );
          })}
      </div>
    </main>
  );
}

export default CadastrarPet;
