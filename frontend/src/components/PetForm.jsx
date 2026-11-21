
import { useState } from "react";
import "./PetForm.css";

// =========================================
// METADADOS DOS ANIMAIS
// =========================================

export function packExtras({ age, sex, species, text }) {
  const cleanAge = (age || "")
    .replace(/[;=\[\]]/g, "")
    .trim();

  const meta = [];

  if (cleanAge) meta.push(`idade=${cleanAge}`);
  if (sex) meta.push(`sexo=${sex}`);
  if (species) meta.push(`especie=${species}`);

  return (
    (meta.length ? `[[${meta.join(";")}]] ` : "") +
    (text || "")
  );
}

export function unpackExtras(description) {
  const result = {
    age: "",
    sex: "",
    species: "",
    text: description || "",
  };

  const match = /^\[\[(.*?)\]\]\s?/.exec(description || "");

  if (!match) return result;

  for (const part of match[1].split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) continue;

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (key === "idade") result.age = value;
    if (key === "sexo") result.sex = value;
    if (key === "especie") result.species = value;
  }

  result.text = description.slice(match[0].length);

  return result;
}

// =========================================
// COMPRESSAO DE IMAGENS
// =========================================

export function compressImage(file, maxLength = 70000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Não foi possível ler o arquivo."));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Não foi possível carregar a imagem."));
      };

      img.onload = () => {
        let size = 500;
        let quality = 0.7;
        let result = "";

        for (let attempt = 0; attempt < 10; attempt++) {
          const scale = Math.min(
            1,
            size / Math.max(img.width, img.height)
          );

          const canvas = document.createElement("canvas");

          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);

          const context = canvas.getContext("2d");

          if (!context) {
            reject(
              new Error("Não foi possível processar a imagem.")
            );
            return;
          }

          context.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          result = canvas.toDataURL("image/jpeg", quality);

          if (result.length <= maxLength) {
            resolve(result);
            return;
          }

          quality = Math.max(0.3, quality - 0.1);
          size = Math.round(size * 0.85);
        }

        if (result.length > maxLength) {
          reject(
            new Error("A imagem é muito grande. Escolha outra imagem.")
          );
          return;
        }

        resolve(result);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

// =========================================
// DATA LOCAL
// =========================================

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// =========================================
// FORMULARIO
// =========================================

function PetForm({ onAddPet }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("dog");
  const [status, setStatus] = useState("lost");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [reportDate, setReportDate] = useState(getLocalDate());
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Selecionar e comprimir imagem.
  async function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }

    try {
      const compressedImage = await compressImage(file);
      setImage(compressedImage);
    } catch (error) {
      console.error("Erro ao carregar a imagem:", error);
      alert(error.message || "Não foi possível carregar a imagem.");
    } finally {
      event.target.value = "";
    }
  }

  // Enviar cadastro.
  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const pet = {
      animal_name: name.trim(),
      animal_type: status,
      status: status,

      description: packExtras({
        age,
        sex,
        species: type,
        text: description,
      }),

      location: location.trim(),
      report_date: reportDate,
      contact_name: contact.trim(),
      contact_phone: contactPhone.trim(),
      image_url: image.trim(),
    };

    try {
      setSubmitting(true);

      await onAddPet(pet);

      // Limpar formulário após cadastro.
      setName("");
      setType("dog");
      setStatus("lost");
      setLocation("");
      setContact("");
      setContactPhone("");
      setReportDate(getLocalDate());
      setDescription("");
      setImage("");
      setAge("");
      setSex("");
    } catch (error) {
      console.error("Erro ao cadastrar o animal:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit}>
      <div className="pet-form-header">
        <h2>Cadastrar um Animal</h2>
        <p>
          Ajude um animal a encontrar o caminho de volta para casa.
        </p>
      </div>

      <div className="pet-form-grid">
        {/* NOME */}
        <div className="pet-form-group">
          <label htmlFor="pet-name">Nome do Animal</label>
          <input
            id="pet-name"
            type="text"
            placeholder="Ex: Mel..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        {/* ESPECIE */}
        <div className="pet-form-group">
          <label htmlFor="pet-species">Tipo de Animal</label>
          <select
            id="pet-species"
            value={type}
            onChange={(event) => setType(event.target.value)}
            required
          >
            <option value="dog">Cachorro</option>
            <option value="cat">Gato</option>
            <option value="other">Outro</option>
          </select>
        </div>

        {/* SITUACAO */}
        <div className="pet-form-group">
          <label htmlFor="pet-status">Situação do Animal</label>
          <select
            id="pet-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            required
          >
            <option value="lost">Perdido</option>
            <option value="found">Encontrado</option>
          </select>
        </div>

        {/* IDADE */}
        <div className="pet-form-group">
          <label htmlFor="pet-age">Idade</label>
          <input
            id="pet-age"
            type="text"
            placeholder="Ex: 3 anos"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        {/* SEXO */}
        <div className="pet-form-group">
          <label htmlFor="pet-sex">Sexo</label>
          <select
            id="pet-sex"
            value={sex}
            onChange={(event) => setSex(event.target.value)}
          >
            <option value="">Não informado</option>
            <option value="male">Macho</option>
            <option value="female">Fêmea</option>
          </select>
        </div>

        {/* LOCALIZACAO */}
        <div className="pet-form-group">
          <label htmlFor="pet-location">Localização</label>
          <input
            id="pet-location"
            type="text"
            placeholder="Ex: Porto Alegre, RS"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />
        </div>

        {/* DATA */}
        <div className="pet-form-group">
          <label htmlFor="pet-date">Data do Registro</label>
          <input
            id="pet-date"
            type="date"
            value={reportDate}
            onChange={(event) => setReportDate(event.target.value)}
            required
          />
        </div>

        {/* CONTATO */}
        <div className="pet-form-group">
          <label htmlFor="pet-contact">Nome para Contato</label>
          <input
            id="pet-contact"
            type="text"
            placeholder="Ex: João..."
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            required
          />
        </div>

        {/* TELEFONE */}
        <div className="pet-form-group">
          <label htmlFor="pet-phone">Telefone para Contato</label>
          <input
            id="pet-phone"
            type="tel"
            placeholder="Ex: (51) 98000-0000"
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            required
          />
        </div>

        {/* IMAGEM */}
        <div className="pet-form-group">
          <label htmlFor="pet-image-url">Imagem (URL ou arquivo)</label>

          <input
            type="file"
            accept="image/*"
            aria-label="Selecionar imagem do animal"
            onChange={handleFile}
          />

          {image && (
            <>
              <img
                src={image}
                alt="Pré-visualização do animal"
                style={{
                  maxWidth: "120px",
                  borderRadius: "8px",
                  marginTop: "8px",
                }}
              />

              <button
                type="button"
                onClick={() => setImage("")}
              >
                Remover imagem
              </button>
            </>
          )}
        </div>

        {/* DESCRICAO */}
        <div className="pet-form-group pet-form-full">
          <label htmlFor="pet-description">Descrição</label>
          <textarea
            id="pet-description"
            placeholder="Ex: Pelo branco, porte pequeno..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
      </div>

      <button
        className="pet-form-button"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Cadastrando..." : "Cadastrar Animal"}
      </button>
    </form>
  );
}

export default PetForm;
