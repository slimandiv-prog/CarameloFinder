import { useEffect, useState } from "react";
import PetForm from "./components/PetForm";
import PetDetails from "./pages/PetDetails";

import {
  createPet,
  getPets,
  deletePet,
} from "./services/api";

function App() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPets() {
    try {
      setLoading(true);
      const data = await getPets();
      setPets(data);
      setMessage("");
    } catch (error) {
      console.error("Erro ao carregar os registros:", error);
      setMessage("Não foi possível carregar os registros. Verifique se o servidor está funcionando.");
    } finally {
      setLoading(false);
    }
  }

  
  useEffect(() => {
    loadPets();
  }, []);


  async function handleAddPet(pet) {
    try {
      await createPet(pet);
      await loadPets();
      setMessage("Registro cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar o registro:", error);
      setMessage("Não foi possível cadastrar o registro.");
      throw error;
    }
  }


  async function handleDeletePet(id) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir este registro?"
    );

    if (!confirmed) return;

    try {
      await deletePet(id);
      await loadPets();
      setMessage("Registro excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o registro:", error);
      setMessage("Não foi possível excluir o registro.");
    }
  }
  if (selectedPetId !== null) {
    return (
      <PetDetails
        petId={selectedPetId}
        onBack={() => {
          setSelectedPetId(null);
          loadPets();
        }}
      />
    );
  }

  return (
    <main className="app">
      <header>
        <h1>CarameloFinder</h1>
        <p>Ajude animais perdidos a encontrarem o caminho de volta para casa.</p>
      </header>

      <section>
        <PetForm onAddPet={handleAddPet} />
      </section>

      {message && <p role="status">{message}</p>}

      <hr />

      <section>
        <h2>Animais Registrados</h2>

        <button onClick={loadPets}>Atualizar Registros</button>

        {loading && <p>Carregando os registros...</p>}

        {!loading && pets.length === 0 && (
          <p>Nenhum registro encontrado.</p>
        )}

        {!loading &&
          pets.map((pet) => (
            <article key={pet.id} className="pet-card">
              {pet.image_url && (
                <img
                  src={pet.image_url}
                  alt={pet.animal_name}
                  style={{ maxWidth: "200px" }}
                />
              )}

              <h3>{pet.animal_name}</h3>

              <p>
                <strong>Tipo de Registro:</strong>{" "}
                {pet.animal_type === "lost" ? "Perdido" : "Encontrado"}
              </p>

              <p>
                <strong>Localização:</strong> {pet.location}
              </p>

              <p>
                <strong>Situação:</strong>{" "}
                {pet.status === "active" ? "Ativo" : "Resolvido"}
              </p>

              <button onClick={() => setSelectedPetId(pet.id)}>
                Ver Detalhes
              </button>

              <button onClick={() => handleDeletePet(pet.id)}>
                Excluir Registro
              </button>
            </article>
          ))}
      </section>
    </main>
  );
}

export default App;
