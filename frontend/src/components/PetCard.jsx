function PetCard({ nome, idade, sexo, situacao, localizacao, data, imagem, contato }) {
    return (
        <article className="cartao-pet">
            <div className="foto-pet">
        <img src={imagem} alt={nome} />
            </div>

          <h3>{nome}</h3>

          <p> Idade: {idade}</p>

          <p className={`situacao-pet ${situacao === "Perdido" || situacao === "Perdida" ? "perdido" : "encontrado"}`}>
            <img src="/pata.png" alt="" className="icone-pet" />
           Situação: {situacao}
        </p>

          <p> Localização: {localizacao}</p>

          <p> Data: {data}</p>

             <p className="sexo-pet">
                Sexo: {sexo}</p>

        {contato && (
            <a href={`tel:${contato}`} className="boton-contato">
            Entrar em contato
            </a>
        )}

        </article>
    )
}

export default PetCard