import { useState } from "react";
import "./PetForm.css";

export function packExtras({ age, sex, text }) {
  const cleanAge = (age || "").replace(/[;=\[\]]/g, "").trim();
  const meta = [];

  if (cleanAge) meta.push(`idade=${cleanAge}`);
  if (sex) meta.push(`sexo=${sex}`);

  return (meta.length ? `[[${meta.join(";")}]] ` : "") + (text || "");
}

export function unpackExtras(description) {
  const result = { age: "", sex: "", text: description || "" };
  const match = /^\[\[(.*?)\]\]\s?/.exec(description || "");

  if (!match) return result;

  for (const part of match[1].split(";")) {
    const [key, value] = part.split("=");
    if (key === "idade") result.age = value || "";
    if (key === "sexo") result.sex = value || "";
  }

  result.text = description.slice(match[0].length);
  return result;
}

export function compressImage(file, maxLength = 70000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let size = 500;
        let quality = 0.7;
        let result = "";

        for (let attempt = 0; attempt < 10; attempt++) {
          const scale = Math.min(1, size / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas
            .getContext("2d")
            .drawImage(img, 0, 0, canvas.width, canvas.height);

          result = canvas.toDataURL("image/jpeg", quality);

          if (result.length <= maxLength) break;

          quality = Math.max(0.3, quality - 0.1);
          size = Math.round(size * 0.85);
        }

        resolve(result);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function PetForm({ onAddPet }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("dog");
  const [status, setStatus] = useState("lost");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [age, setAge] = useState(""); 
  const [sex, setSex] = useState(""); 


  async function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImage(await compressImage(file));
    } catch (error) {
      console.error("Erro ao carregar a imagem:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const pet = {
      animal_name: name.trim(),
      animal_type: status,
      status: status,
      description: packExtras({ age, sex, text: description }), // NOVO
      location: location.trim(),
      report_date: reportDate,
      contact_name: contact.trim(),
      contact_phone: contactPhone.trim(),
      image_url: image.trim()
    };

    try {
      await onAddPet(pet);

      setName("");
      setType("dog");
      setStatus("lost");
      setLocation("");
      setContact("");
      setContactPhone("");
      setReportDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setImage("");
      setAge("");
      setSex("");

    } catch (error) {
      console.error("Erro ao cadastrar o animal:", error);
    }
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit}>

      <div className="pet-form-header">
        <h2>Cadastrar um Animal</h2>
        <p>Ajude um animal a encontrar o caminho de volta para casa.</p>
      </div>

      <div className="pet-form-grid">

        <div className="pet-form-group">
          <label>Nome do Animal</label>
          <input
            type="text"
            placeholder="Ex: Mel..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="pet-form-group">
          <label>Tipo de Animal</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="dog">Cachorro</option>
            <option value="cat">Gato</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="pet-form-group">
          <label>Situação do Animal</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="lost">Perdido</option>
            <option value="found">Encontrado</option>
          </select>
        </div>

        <div className="pet-form-group">
          <label>Idade</label>
          <input
            type="text"
            placeholder="Ex: 3 anos"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="pet-form-group">
          <label>Sexo</label>
          <select
            value={sex}
            onChange={(event) => setSex(event.target.value)}
          >
            <option value="">Não informado</option>
            <option value="male">Macho</option>
            <option value="female">Fêmea</option>
          </select>
        </div>

        <div className="pet-form-group">
          <label>Localização</label>
          <input
            type="text"
            placeholder="Ex: São Paulo, SP"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />
        </div>

        <div className="pet-form-group">
          <label>Data do Registro</label>
          <input
            type="date"
            value={reportDate}
            onChange={(event) => setReportDate(event.target.value)}
            required
          />
        </div>

        <div className="pet-form-group">
          <label>Nome para Contato</label>
          <input
            type="text"
            placeholder="Ex: John Doe..."
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            required
          />
        </div>

        <div className="pet-form-group">
          <label>Telefone para Contato</label>
          <input
            type="tel"
            placeholder="Ex: (11) 98000-0000"
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            required
          />
        </div>

        <div className="pet-form-group">
          <label>Imagem (URL ou arquivo)</label>
          <input
            type="url"
            placeholder="Cole o link da imagem"
            value={image.startsWith("data:") ? "" : image}
            onChange={(event) => setImage(event.target.value)}
          />

          {/* NOVO: escolher um arquivo do computador */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
          />

          {image && (
            <>
              <img
                src={image}
                alt="Pré-visualização"
                style={{ maxWidth: "120px", borderRadius: "8px", marginTop: "8px" }}
              />
              <button type="button" onClick={() => setImage("")}>
                Remover imagem
              </button>
            </>
          )}
        </div>

        <div className="pet-form-group pet-form-full">
          <label>Descrição</label>
          <textarea
            placeholder="Ex: Pelo branco, porte pequeno..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

      </div>

      <button className="pet-form-button" type="submit">
        Cadastrar Animal
      </button>

    </form>
  );
}

export default PetForm;