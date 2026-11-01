
import { useState } from "react";

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

  async function handleSubmit(event) {
    event.preventDefault();

    const pet = {
      animal_name: name.trim(),
      animal_type: status,
      description,
      location: location.trim(),
      report_date: reportDate,
      contact_name: contact.trim(),
      contact_phone: contactPhone.trim(),
      image_url: ""
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
    } catch (error) {
      console.error("Erro ao cadastrar o animal:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar um Animal</h2>

      <label>Nome do Animal</label>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label>Tipo de Animal</label>
      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="dog">Cachorro</option>
        <option value="cat">Gato</option>
        <option value="other">Outro</option>
      </select>

      <label>Situação do Animal</label>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="lost">Perdido</option>
        <option value="found">Encontrado</option>
      </select>

      <label>Localização</label>
      <input
        type="text"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        required
      />

      <label>Data do Registro</label>
      <input
        type="date"
        value={reportDate}
        onChange={(event) => setReportDate(event.target.value)}
        required
      />

      <label>Nome para Contato</label>
      <input
        type="text"
        value={contact}
        onChange={(event) => setContact(event.target.value)}
        required
      />

      <label>Telefone para Contato</label>
      <input
        type="tel"
        value={contactPhone}
        onChange={(event) => setContactPhone(event.target.value)}
        required
      />

      <label>Descrição</label>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <button type="submit">Cadastrar Animal</button>
    </form>
  );
}

export default PetForm;
