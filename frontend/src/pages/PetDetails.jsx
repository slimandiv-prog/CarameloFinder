import { useEffect, useState } from "react";
import { getPetById, updatePet } from "../services/api";
import { getUser } from "../services/auth";
import { compressImage, packExtras, unpackExtras } from "../components/PetForm";
import "./CadastrarPet.css";
function withExtras(data) {
  const extras = unpackExtras(data.description);

  return {
    ...data,
    age: extras.age,
    sex: extras.sex,
    description: extras.text,
  };
}

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
        const data = withExtras(await getPetById(petId));

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


  async function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await compressImage(file);

      setPet((previousPet) => ({
        ...previousPet,
        image_url: dataUrl,
      }));
    } catch (error) {
      console.error("Erro ao carregar a imagem:", error);
    }
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
        description: packExtras({
          age: pet.age,
          sex: pet.sex,
          text: pet.description,
        }),
        location: pet.location,
        report_date: pet.report_date,
        contact_name: pet.contact_name,
        contact_phone: pet.contact_phone,
        image_url: pet.image_url || "",
        status: pet.status,
      };

      await updatePet(petId, reportData);

      const updatedPet = withExtras(await getPetById(petId));

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
    return <main className="cp-page"><p>Carregando os detalhes do registro...</p></main>;
  }

  if (error && !pet) {
    return (
      <main className="cp-page">
        <p className="cp-erro" role="alert">{error}</p>
        <button className="cp-btn-sec" type="button" onClick={onBack}>Voltar</button>
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="cp-page">
        <p>Registro não encontrado.</p>
        <button className="cp-btn-sec" type="button" onClick={onBack}>Voltar</button>
      </main>
    );
  }

  const isOwner = getUser()?.id === pet.user_id;

  return (
    <main className="cp-page">
      <button className="cp-link" type="button" onClick={onBack}>← Voltar</button>

      {error && <p className="cp-erro" role="alert">{error}</p>}
      {message && <p className="cp-msg" role="status">{message}</p>}

      {isEditing ? (
        <form className="cp-form" onSubmit={handleUpdate}>
          <h2>Editar registro</h2>

          <div className="cp-grid">
            <label htmlFor="animal-name">Nome do Animal
              <input id="animal-name" type="text" name="animal_name"
                value={pet.animal_name || ""} onChange={handleChange} required />
            </label>

            <label htmlFor="animal-type">Tipo de Registro
              <select id="animal-type" name="animal_type"
                value={pet.animal_type || "lost"} onChange={handleChange} required>
                <option value="lost">Perdido</option>
                <option value="found">Encontrado</option>
              </select>
            </label>

            <label htmlFor="report-status">Situação do Registro
              <select id="report-status" name="status"
                value={pet.status || "active"} onChange={handleChange} required>
                <option value="active">Ativo</option>
                <option value="resolved">Resolvido</option>
              </select>
            </label>

            <label htmlFor="animal-age">Idade
              <input id="animal-age" type="text" name="age"
                value={pet.age || ""} onChange={handleChange} placeholder="Ex: 3 anos" />
            </label>

            <label htmlFor="animal-sex">Sexo
              <select id="animal-sex" name="sex"
                value={pet.sex || ""} onChange={handleChange}>
                <option value="">Não informado</option>
                <option value="male">Macho</option>
                <option value="female">Fêmea</option>
              </select>
            </label>

            <label htmlFor="report-location">Localização
              <input id="report-location" type="text" name="location"
                value={pet.location || ""} onChange={handleChange} required />
            </label>

            <label htmlFor="report-date">Data do Registro
              <input id="report-date" type="date" name="report_date"
                value={pet.report_date || ""} onChange={handleChange} required />
            </label>

            <label htmlFor="contact-name">Nome para Contato
              <input id="contact-name" type="text" name="contact_name"
                value={pet.contact_name || ""} onChange={handleChange} required />
            </label>

            <label htmlFor="contact-phone">Telefone ou E-mail para Contato
              <input id="contact-phone" type="text" name="contact_phone"
                value={pet.contact_phone || ""} onChange={handleChange} required />
            </label>

            <div className="cp-full" style={{ display: "grid", gap: "8px" }}>
              <label htmlFor="report-image">Imagem (URL ou arquivo)
                <input id="report-image" type="text" name="image_url"
                  value={(pet.image_url || "").startsWith("data:") ? "" : pet.image_url || ""}
                  onChange={handleChange} />
              </label>

              {/*  escolher um arquivo do computador */}
              <input type="file" accept="image/*" onChange={handleFile} />

              {pet.image_url && (
                <div>
                  <img src={pet.image_url} alt="Pré-visualização"
                    style={{ maxWidth: "120px", borderRadius: "8px", display: "block", marginBottom: "8px" }} />
                  <button className="cp-btn-sec" type="button"
                    onClick={() => setPet((previousPet) => ({ ...previousPet, image_url: "" }))}>
                    Remover imagem
                  </button>
                </div>
              )}
            </div>

            <label className="cp-full" htmlFor="report-description">Descrição
              <textarea id="report-description" name="description"
                value={pet.description || ""} onChange={handleChange} />
            </label>
          </div>

          <div className="cp-acoes">
            <button className="cp-btn" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button className="cp-btn-sec" type="button" onClick={handleCancel} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="cp-detalhes-box">
          <div className="cp-img grande">
            {pet.image_url ? <img src={pet.image_url} alt={pet.animal_name} /> : <span>🐾</span>}
          </div>

          <div>
            <h1>{pet.animal_name}</h1>

            <span className={`cp-tag ${pet.animal_type === "lost" ? "perdido" : "encontrado"}`}>
              {pet.animal_type === "lost" ? "Perdido" : "Encontrado"}
            </span>
            <span className={`cp-tag ${pet.status === "resolved" ? "resolvido" : ""}`}>
              {pet.status === "active" ? "Ativo" : "Resolvido"}
            </span>

            <p><strong>Idade:</strong> {pet.age || "Não informada"}</p>
            <p><strong>Sexo:</strong> {pet.sex === "male" ? "Macho" : pet.sex === "female" ? "Fêmea" : "Não informado"}</p>
            <p><strong>Localização:</strong> {pet.location}</p>
            <p><strong>Data do Registro:</strong> {pet.report_date ? pet.report_date.split("-").reverse().join("/") : ""}</p>
            <p><strong>Nome para Contato:</strong> {pet.contact_name}</p>
            <p><strong>Contato:</strong> {pet.contact_phone}</p>
            <p><strong>Descrição:</strong> {pet.description || "Nenhuma descrição disponível."}</p>

            {isOwner && (
              <div className="cp-acoes">
                <button className="cp-btn" type="button"
                  onClick={() => { setMessage(""); setError(""); setIsEditing(true); }}>
                  Editar Registro
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default PetDetails;