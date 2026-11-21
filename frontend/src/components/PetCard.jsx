
function PetCard({
  nome,
  idade,
  sexo,
  especie,
  situacao,
  localizacao,
  data,
  imagem,
  contato,
}) {
  const isLost =
    situacao === "Perdido" ||
    situacao === "Perdida" ||
    situacao === "lost";

  const speciesLabels = {
    dog: "Cachorro",
    cat: "Gato",
    other: "Outro",
  };

  const sexLabels = {
    male: "Macho",
    female: "Fêmea",
  };

  const speciesLabel =
    speciesLabels[especie] || "Não informado";

  const sexLabel =
    sexLabels[sexo] || "Não informado";

  return (
    <article className="cartao-pet">
      <div className="foto-pet">
        <img
          src={imagem || "/placeholder-pet.png"}
          alt={`Foto de ${nome || "animal"}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/placeholder-pet.png";
          }}
        />
      </div>

      <div className="pet-card-content">
        <span className="pet-species">
          {speciesLabel}
        </span>

        <h3>{nome || "Animal sem nome"}</h3>

        <p>
          <strong>Idade:</strong>{" "}
          {idade || "Não informada"}
        </p>

        <p className={`situacao-pet ${isLost ? "perdido" : "encontrado"}`}>
          <img
            src="/pata.png"
            alt=""
            className="icone-pet"
            aria-hidden="true"
          />
          Situação: {situacao || "Não informada"}
        </p>

        <p>
          <strong>Sexo:</strong> {sexLabel}
        </p>

        <p>
          <strong>Localização:</strong>{" "}
          {localizacao || "Não informada"}
        </p>

        <p>
          <strong>Data:</strong> {data || "Não informada"}
        </p>

        {contato && (
          <a
            href={`tel:${contato}`}
            className="boton-contato"
          >
            Entrar em contato
          </a>
        )}
      </div>
    </article>
  );
}

export default PetCard;
