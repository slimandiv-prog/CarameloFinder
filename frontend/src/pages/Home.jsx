
import { useMemo, useState } from "react";

import PetCard from "../components/PetCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Header from "../components/Header.jsx";
import PetForm from "../components/PetForm.jsx";
import { unpackExtras } from "../components/PetForm";

function Home({
  apiPets = [],
  onViewDetails,
  onAddPet,
  onLogin,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [menuActivo, setMenuActivo] = useState("Início");

  const pets = useMemo(() => {
    return apiPets.map((pet) => {
      const extras = unpackExtras(pet.description || "");
      const isFemale = extras.sex === "female";
      const isLost = pet.animal_type === "lost";

      return {
        id: pet.id,
        apiId: pet.id,
        nome: pet.animal_name || "Animal sem nome",
        idade: extras.age || "",
        sexo: extras.sex || "",
        especie: extras.species || "",
        situacao: isLost
          ? isFemale ? "Perdida" : "Perdido"
          : isFemale ? "Encontrada" : "Encontrado",
        localizacao: pet.location || "Localização não informada",
        data: pet.report_date
          ? pet.report_date.split("-").reverse().join("/")
          : "Não informada",
        imagem: pet.image_url || "/caramelofinder-logo.png",
        status: pet.status || "active",
      };
    });
  }, [apiPets]);

  const petsFiltrados = useMemo(() => {
    const termo = busqueda.trim().toLocaleLowerCase("pt-BR");

    return pets.filter((pet) => {
      const nome = pet.nome.toLocaleLowerCase("pt-BR");
      const localizacao = pet.localizacao.toLocaleLowerCase("pt-BR");

      const correspondeBusca =
        nome.includes(termo) || localizacao.includes(termo);

      const correspondeFiltro =
        filtro === "Todos" ||
        (filtro === "Perdidos" &&
          ["Perdido", "Perdida"].includes(pet.situacao)) ||
        (filtro === "Encontrados" &&
          ["Encontrado", "Encontrada"].includes(pet.situacao));

      return correspondeBusca && correspondeFiltro;
    });
  }, [pets, busqueda, filtro]);

  function handleFilterChange(value) {
    setFiltro(value);
    setMenuActivo(value === "Todos" ? "Início" : value);
  }

  function handleViewDetails(petId) {
    onViewDetails?.(petId);
  }

  return (
    <div className="home">
      <Header
        menuActivo={menuActivo}
        setMenuActivo={setMenuActivo}
        setFiltro={setFiltro}
        onLogin={onLogin}
      />

      {/* HERO */}
      <section className="apresentacao-home">
        <div className="conteudo-hero">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            CARAMELO FINDER
          </span>

          <h1 className="titulo-home">
            <span>Juntos</span>
            <span>encontramos</span>
            <span className="titulo-destaque">lares 🐾</span>
          </h1>

          <p className="descricao">
            Caramelo Finder é uma plataforma para ajudar a encontrar
            animais de estimação perdidos e reuni-los com suas famílias.
          </p>

          <div className="hero-beneficios">
            <div className="hero-beneficio">
              <span className="beneficio-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
              </span>
              <span>Conecta Comunidades</span>
            </div>

            <div className="hero-beneficio">
              <span className="beneficio-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span>Compartilha relatos seguros</span>
            </div>

            <div className="hero-beneficio">
              <span className="beneficio-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <ellipse cx="12" cy="16" rx="6" ry="5" />
                  <ellipse cx="5" cy="9" rx="2.5" ry="3" />
                  <ellipse cx="10" cy="5" rx="2.5" ry="3" />
                  <ellipse cx="16" cy="5" rx="2.5" ry="3" />
                  <ellipse cx="20" cy="9" rx="2.5" ry="3" />
                </svg>
              </span>
              <span>Mais possibilidades de se reunir</span>
            </div>
          </div>
        </div>

        <div className="imagem-hero">
          <img
            src="/perrita.png"
            alt="Mascote CarameloFinder"
          />
        </div>

        <div className="hero-form-wrapper" id="cadastrar">
          <PetForm onAddPet={onAddPet} />
        </div>
      </section>

      {/* RELATÓRIOS RECENTES */}
      <section className="secao-relatos" id="relatos">
        <div className="relatos-heading">
          <div>
            <span className="section-eyebrow">FAÇA PARTE DESSA CAUSA</span>
            <h2 className="titulo-relatos">
              Relatórios recentes
              <span className="titulo-paw">🐾</span>
            </h2>
          </div>

          <span className="relatos-heading-icon">♡</span>
        </div>

        <div className="relatos-toolbar">
          <SearchBar
            busqueda={busqueda}
            setBusqueda={setBusqueda}
          />

          <div className="filtros-relatos" aria-label="Filtrar registros">
            {["Todos", "Perdidos", "Encontrados"].map((item) => (
              <button
                key={item}
                type="button"
                className={filtro === item ? "ativo" : ""}
                aria-pressed={filtro === item}
                onClick={() => handleFilterChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="resultado-relatos" aria-live="polite">
          {petsFiltrados.length === 1
            ? "1 registro encontrado"
            : `${petsFiltrados.length} registros encontrados`}
        </div>

        <div className="lista-pets">
          {petsFiltrados.length > 0 ? (
            petsFiltrados.map((pet) => (
              <div
                key={pet.id}
                className="pet-card-interativo"
                role="button"
                tabIndex={0}
                aria-label={`Ver detalhes de ${pet.nome}`}
                onClick={() => handleViewDetails(pet.apiId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleViewDetails(pet.apiId);
                  }
                }}
              >
                <PetCard
                  nome={pet.nome}
                  idade={pet.idade}
                  sexo={pet.sexo}
                  especie={pet.especie}
                  situacao={pet.situacao}
                  localizacao={pet.localizacao}
                  data={pet.data}
                  imagem={pet.imagem}
                />
              </div>
            ))
          ) : (
            <div className="relatos-vazios">
              <span className="relatos-vazios-icone">🐾</span>
              <h3>
                {pets.length === 0
                  ? "Ainda não temos registros"
                  : "Nenhum animal encontrado"}
              </h3>
              <p>
                {pets.length === 0
                  ? "Seja o primeiro a compartilhar um relato e ajudar um animal."
                  : "Tente buscar por outro nome ou localização, ou altere os filtros."}
              </p>

              {(busqueda || filtro !== "Todos") && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    handleFilterChange("Todos");
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* AJUDA */}
      <section id="ajuda" className="ajuda">
        <span className="section-eyebrow">ESTAMOS AQUI PARA AJUDAR</span>
        <h2>Precisa de ajuda?</h2>
        <h3>Como utilizar o CarameloFinder?</h3>
        <ol>
          <li>Procure um animal pelo nome ou localização.</li>
          <li>Utilize as opções Perdidos e Encontrados para filtrar os relatos.</li>
          <li>Compartilhe os relatos para ajudar os animais a reencontrarem suas famílias.</li>
        </ol>
      </section>

      {/* REDES SOCIAIS */}
      <section className="redes-sociais">
        <h2 className="titulo-redes">Compartilhe nossa causa. 🐾</h2>
        <p>Ajude mais animais a reencontrarem suas famílias</p>

        <div className="icones-redes">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src="/instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <img src="/facebook.png" alt="Facebook" />
          </a>
          <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <img src="/whatsapp.png" alt="WhatsApp" />
          </a>
        </div>
      </section>

      <footer className="rodape">
        <p>🐾 CarameloFinder - Juntos encontramos lares!</p>
        <p>© 2026 CarameloFinder. Projeto desenvolvido para o curso de Front End.</p>
      </footer>
    </div>
  );
}

export default Home;
