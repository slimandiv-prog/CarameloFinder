
import "./PetList.css";
import { useEffect, useState, useCallback } from "react";

import PetDetails from "./pages/PetDetails";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import CadastrarPet from "./pages/CadastrarPet";
import UserBar from "./components/UserBar";

import "./App.css";
import "./UserWelcome.css";

import { isLoggedIn, logout } from "./services/auth";
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

  // Carregar os registros públicos.
  const loadPets = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPets();

      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar os registros:", error);

      setMessage(
        "Não foi possível carregar os registros. Verifique se o servidor está funcionando."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar registros ao iniciar a aplicação.
  useEffect(() => {
    loadPets();
  }, [loadPets]);

  // Monitorar expiração da sessão.
  useEffect(() => {
    function handleAuthExpired() {
      setLoggedIn(false);
      setSelectedPetId(null);
      setPage("home");
      setMessage(
        "Sua sessão expirou. Faça login novamente para continuar."
      );
    }

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, []);

  // Tratar acesso ao formulário pela navegação com hash.
  useEffect(() => {
    function handleHash() {
      if (window.location.hash === "#cadastrar") {
        setMessage("");

        if (isLoggedIn()) {
          setLoggedIn(true);
          setPage("cadastrar");
        } else {
          setPage("login");
        }

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

    return () => {
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  // Login realizado com sucesso.
  function handleLoginSuccess() {
    setLoggedIn(true);
    setSelectedPetId(null);
    setMessage("");
    setPage("cadastrar");

    loadPets();
  }

  // Abrir tela de login.
  function handleOpenLogin() {
    setMessage("");
    setPage("login");
    window.scrollTo(0, 0);
  }

  // Encerrar sessão.
  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setLoggedIn(false);
      setSelectedPetId(null);
      setMessage("");
      setPage("home");

      loadPets();
    }
  }

  // Cadastrar animal.
  async function handleAddPet(pet) {
    if (!isLoggedIn()) {
      setLoggedIn(false);
      setPage("login");

      throw new Error(
        "Você precisa fazer login para cadastrar um registro."
      );
    }

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

  // Excluir animal.
  async function handleDeletePet(id) {
    if (!isLoggedIn()) {
      setLoggedIn(false);
      setPage("login");

      throw new Error(
        "Você precisa fazer login para excluir um registro."
      );
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

      throw error;
    }
  }

  // Detalhes públicos.
  if (selectedPetId !== null) {
    return (
      <main className="app">
        <PetDetails
          petId={selectedPetId}
          onBack={() => {
            setSelectedPetId(null);
            loadPets();
          }}
        />
      </main>
    );
  }

  // Login.
  if (page === "login") {
    return (
      <main className="app">
        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="login-back">
          <button
            type="button"
            className="cp-link"
            onClick={() => {
              setPage("home");
              setMessage("");
            }}
          >
            ← Voltar para o início
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      {loggedIn && (
        <UserBar
          page={page}
          onHome={() => {
            setPage("home");
            setMessage("");
          }}
          onLogout={handleLogout}
        />
      )}

      {page === "home" && (
        <>
          <Home
            apiPets={pets}
            onViewDetails={setSelectedPetId}
            onAddPet={handleAddPet}
            onLogin={handleOpenLogin}
          />

          {loading && (
            <p className="app-loading">
              Carregando registros...
            </p>
          )}

          {message && (
            <p className="app-message" role="alert">
              {message}
            </p>
          )}
        </>
      )}

      {page === "cadastrar" && loggedIn && (
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
