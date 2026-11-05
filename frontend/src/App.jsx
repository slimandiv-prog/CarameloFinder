import "./PetList.css";
import { useEffect, useState } from "react";
import PetDetails from "./pages/PetDetails";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import CadastrarPet from "./pages/CadastrarPet";
import UserBar from "./components/UserBar"; 

import "./App.css";
import "./UserWelcome.css";

import {
  isLoggedIn,
  logout,
} from "./services/auth";

import { getPets } from "./services/api";

import {
  createAuthenticatedPet,
  deleteAuthenticatedPet,
} from "./services/authenticatedApi";

function App() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");

  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  async function loadPets() {
    try {
      setLoading(true);

      const data = await getPets();

      setPets(data);
      setMessage("");
    } catch (error) {
      console.error("Erro ao carregar os registros:", error);

      setMessage(
        "Não foi possível carregar os registros. Verifique se o servidor está funcionando."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadPets();
    }
  }, [loggedIn]);

  useEffect(() => {
    function handleHash() {
      if (window.location.hash === "#cadastrar") {
        setMessage("");
        setPage("cadastrar");
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
        window.scrollTo(0, 0);
      }
    }

    window.addEventListener("hashchange", handleHash);
    handleHash();

    return () => window.removeEventListener("hashchange", handleHash);
  }, []);


  function handleLoginSuccess() {
    setLoggedIn(true);
    setSelectedPetId(null);
    setMessage("Login realizado com sucesso!");
  }


  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setLoggedIn(false);
      setSelectedPetId(null);
      setPets([]);
      setMessage("");
      setPage("home");
    }
  }


  async function handleAddPet(pet) {
    try {
      await createAuthenticatedPet(pet);

      await loadPets();

      setMessage("Registro cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar o registro:", error);

      setMessage(
        error.message || "Não foi possível cadastrar o registro."
      );

      throw error;
    }
  }


  async function handleDeletePet(id) {
    if (!isLoggedIn()) {
      setMessage("Você precisa fazer login para excluir um registro.");
      return;
    }

    try {
      await deleteAuthenticatedPet(id);

      await loadPets();

      setMessage("Registro excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o registro:", error);

      setMessage(
        error.message || "Não foi possível excluir o registro."
      );
    }
  }

  if (!loggedIn) {
    return (
      <main className="app">
        <LoginForm onSuccess={handleLoginSuccess} />
      </main>
    );
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

    
      <UserBar
        page={page}
        onHome={() => setPage("home")}
        onLogout={handleLogout}
      />

     
      {page === "home" && (
        <header>
          <Home apiPets={pets} onViewDetails={setSelectedPetId} />

          <p>
            Ajude animais perdidos a encontrarem o caminho de volta para casa.
          </p>
        </header>
      )}

      
      {page === "cadastrar" && (
        <CadastrarPet
          pets={pets}
          loading={loading}
          message={message}
          onAddPet={handleAddPet}
          onDeletePet={handleDeletePet}
          onReload={loadPets}
          onViewDetails={setSelectedPetId}
        />
      )}

    </main>
  );
}

export default App;
