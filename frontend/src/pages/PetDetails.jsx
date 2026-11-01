
import { useEffect, useState } from "react";
import { getPetById, updatePet } from "../services/api";

function PetDetails({ petId, onBack }) {
  const [pet, setPet] = useState(null);
  const [originalPet, setOriginalPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadPet() {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const data = await getPetById(petId);

        setPet(data);
        setOriginalPet(data);
      } catch (error) {
        console.error("Erro ao carregar o registro:", error);
        setError("Não foi possível carregar os detalhes do registro.");
      } finally {
        setLoading(false);
      }
    }

    loadPet();
  }, [petId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setPet((previousPet) => ({
      ...previousPet,
      [name]: value,
    }));
  }

  async function handleUpdate(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const reportData = {
        animal_name: pet.animal_name,
        animal_type: pet.animal_type,
        description: pet.description || "",
        location: pet.location,
        report_date: pet.report_date,
        contact_name: pet.contact_name,
        contact_phone: pet.contact_phone,
        image_url: pet.image_url || "",
        status: pet.status,
      };

      await updatePet(petId, reportData);

      const updatedPet = await getPetById(petId);

      setPet(updatedPet);
      setOriginalPet(updatedPet);
      setIsEditing(false);
      setMessage("Registro atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o registro:", error);
      setError(
        "Não foi possível atualizar o registro. Verifique os campos obrigatórios."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setPet(originalPet);
    setIsEditing(false);
    setError("");
    setMessage("");
  }

  if (loading) {
    return <p>Carregando os detalhes do registro...</p>;
  }

  if (error && !pet) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button type="button" onClick={onBack}>
          Voltar
        </button>
      </div>
    );
  }

  if (!pet) {
    return (
      <div>
        <p>Registro não encontrado.</p>
        <button type="button" onClick={onBack}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={onBack}>
        Voltar
      </button>

      <h2>Detalhes do Registro</h2>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="animal-name">Nome do Animal:</label>
            <input
              id="animal-name"
              type="text"
              name="animal_name"
              value={pet.animal_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="animal-type">Tipo de Registro:</label>
            <select
              id="animal-type"
              name="animal_type"
              value={pet.animal_type || "lost"}
              onChange={handleChange}
              required
            >
              <option value="lost">Perdido</option>
              <option value="found">Encontrado</option>
            </select>
          </div>

          <div>
            <label htmlFor="report-status">Situação do Registro:</label>
            <select
              id="report-status"
              name="status"
              value={pet.status || "active"}
              onChange={handleChange}
              required
            >
              <option value="active">Ativo</option>
              <option value="resolved">Resolvido</option>
            </select>
          </div>

          <div>
            <label htmlFor="report-location">Localização:</label>
            <input
              id="report-location"
              type="text"
              name="location"
              value={pet.location || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="report-date">Data do Registro:</label>
            <input
              id="report-date"
              type="date"
              name="report_date"
              value={pet.report_date || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="contact-name">Nome para Contato:</label>
            <input
              id="contact-name"
              type="text"
              name="contact_name"
              value={pet.contact_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="contact-phone">
              Telefone ou E-mail para Contato:
            </label>
            <input
              id="contact-phone"
              type="text"
              name="contact_phone"
              value={pet.contact_phone || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="report-description">Descrição:</label>
            <textarea
              id="report-description"
              name="description"
              value={pet.description || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="report-image">URL da Imagem:</label>
            <input
              id="report-image"
              type="text"
              name="image_url"
              value={pet.image_url || ""}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <div>
          <h3>{pet.animal_name}</h3>

          {pet.image_url && (
            <img
              src={pet.image_url}
              alt={pet.animal_name}
              style={{ maxWidth: "300px", height: "auto" }}
            />
          )}

          <p>
            Tipo de Registro:{" "}
            {pet.animal_type === "lost" ? "Perdido" : "Encontrado"}
          </p>

          <p>
            Situação do Registro:{" "}
            {pet.status === "active" ? "Ativo" : "Resolvido"}
          </p>

          <p>Localização: {pet.location}</p>
          <p>Data do Registro: {pet.report_date}</p>
          <p>Nome para Contato: {pet.contact_name}</p>
          <p>Contato: {pet.contact_phone}</p>

          <p>
            Descrição:{" "}
            {pet.description || "Nenhuma descrição disponível."}
          </p>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setError("");
              setIsEditing(true);
            }}
          >
            Editar Registro
          </button>
        </div>
      )}
    </div>
  );
}

export default PetDetails;
