import PetCard from "../components/PetCard.jsx"
import SearchBar from "../components/SearchBar.jsx"
import { useState } from "react"
import Header from "../components/Header.jsx";

function Home() {
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("Todos");
    const [menuActivo, setMenuActivo] = useState("Início");

    const pets = [
        {
            id: 1,
            nome: "Mel",
            idade: "10 anos",
            sexo: "Fêmea",
            situacao: "Perdida",
            localizacao: "Campinas - SP",
            data: "25/10/2026",
            imagem: "/pets/Mel.jpeg",
        },
        {
            id: 2,
            nome: "Fofinha",
            idade: "4 anos",
            sexo: "Fêmea",
            situacao: "Encontrada",
            localizacao: "São Paulo - SP",
            data: "12/09/2026",
            imagem: "/pets/Fofinha.jpeg",
        },
        {
            id: 3,
            nome: "Lalo",
            idade: "3 anos",
            sexo: "Macho",
            situacao: "Encontrado",
            localizacao: "Manaus - AM",
            data: "03/08/2024",
            imagem: "/pets/Lalo.jpeg",
        },
        {
            id: 4,
            nome: "Sashi",
            idade: "8 anos",
            sexo: "Fêmea",
            situacao: "Encontrada",
            localizacao:"Manaus - AM",
            data: "28/06/2024",
            imagem: "/pets/Sashi.jpeg",
        },
        {
            id: 5,
            nome: "Patroclo",
            idade: "1 ano",
            sexo: "Macho",
            situacao: "Perdido",
            localizacao: "Curitiba - PR",
            data: "28/12/2023",
            imagem: "/pets/protoclo.jpeg",
        },
        {
            id: 6,
            nome: "Charly",
            idade: "4 anos",
            sexo: "Fêmea",
            situacao: "Encontrada",
            localizacao: "Porto Alegre - RS",
            data: "09/09/2023",
            imagem: "/pets/Charly.jpeg",
        },
        {
            id: 7,
            nome: "Branquinho",
            idade: "5 anos",
            sexo: "Macho",
            situacao: "Perdido",
            localizacao: "Curitiba - PR",
            data: "14/02/2023",
            imagem: "/pets/Branquinho.jpeg",
        },
        {
            id: 8,
            nome: "Papi",
            idade: "6 anos",
            sexo: "Macho",
            situacao: "Perdido",
            localizacao: "Curitiba - PR",
            data: "14/10/2021",
            imagem: "/pets/Papi.jpeg",
        },
        {
            id: 9,
            nome: "Peludo",
            idade: "1 ano",
            sexo: "Macho",
            situacao: "Encontrado",
            localizacao: "Porto Alegre - RS",
            data: "09/10/2021",
            imagem: "/pets/Peludo.jpeg",
        },
        {
            id: 10,
            nome: "Silvet",
            idade: "5 anos",
            sexo: "Fêmea",
            situacao: "Perdida",
            localizacao: "Curitiba - PR",
            data: "14/02/2018",
            imagem: "/pets/silvet.jpeg",
        },
        {
            id: 11,
            nome: "Sam",
            sexo: "Macho",
            idade: "4 anos",
            situacao: "Perdido",
            localizacao: "Campinas - SP",
            data: "05/01/2018",
            imagem: "/pets/sam.jpeg",
        },
        {
            id: 12,
            nome: "Chin Chin",
            sexo: "Macho",
            idade: "7 anos",
            situacao: "Encontrado",
            localizacao: "São Paulo - SP",
            data: "15/10/2017",
            imagem: "/pets/chinchin.jpeg",
        },
    ]

    const petsFiltrados = pets.filter((pet) => {
        const coincideBusqueda =
        pet.nome.toLowerCase().includes(busqueda.toLowerCase()) ||
    pet.localizacao.toLowerCase().includes(busqueda.toLowerCase())

    const coincideFiltro =
    filtro === "Todos" ||
    (filtro === "Perdidos" &&
        (pet.situacao === "Perdido" || pet.situacao === "Perdida")) ||
        (filtro === "Encontrados" &&
            (pet.situacao === "Encontrado" || pet.situacao === "Encontrada"))

            return coincideBusqueda && coincideFiltro
            })

return (
    <main className="home">

        <section className="boas-vindas">

            <Header
                menuActivo={menuActivo}
                setMenuActivo={setMenuActivo}
                setFiltro={setFiltro}

            />
          <div className="imagem-boas-vindas">
        <img src="/caramelofinder-logo.png" alt="Logo do CarameloFinder" />
            </div>

            <div className="texto-boas-vindas">

    <div className="marca-home">
       <h1>
        Caramelo<span className="nombre-finder">Finder</span>
       </h1>
       <p className="frase-destaque">
        <img src="/patas.png" alt="" className="icone-reencontro" />
         Cada reencontro importa.</p>
    </div>

       <h2 className="titulo-home">Juntos encontramos lares!
        <img src="/coracaorojo.png" alt="" className="coracao-home" />
        <img src="/pata.png" alt="" className="patitas-home" />
        </h2>

       <p className="descricao">
        O CarameloFinder é uma plataforma criada para ajudar a divulgar animais perdidos e encontrados, facilitando o reencontro dos pets com suas famílias.
        </p>

        <a href="#relatos" className="boton-relatos">
            Ver relatos
            <img src="/patas.png" alt="" className="icone-boton-relatos" />
        </a>

        </div>
        </section>

        <div className="mensagens-carinho">
            <div className="mensagem-item">
                <span className="icone-carinho">
                <img src="/coracaorojo.png" alt="" className="imagem-carinho" />
                </span>
            <p>Espalhe carinho</p>
            </div>

            <div className="mensagem-item">
                <span className="icone-carinho">
                    <img src="/megaphone.png" alt="" className="imagem-carinho"/>
                </span>
                <p>Compartilhe, ajude e espalhe carinho</p>
            </div>

            <div className="mensagem-item">
                <span className="icone-carinho">
                    <img src="/patas.png" alt="" className="imagem-carinho" />

                </span>
            <p> Cada relato é uma nova chance de reencontro</p>
            </div>

        </div>


        <section id="relatos">
            <h2 className="titulo-relatos">Relatos recentes</h2>
            <div className="linha-relatos"></div>

            <SearchBar
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            />

            <div className="lista-pets">

          {petsFiltrados.map((pet) => (
                <PetCard
                key={pet.id}
                nome={pet.nome}
                idade={pet.idade}
                sexo={pet.sexo}
                situacao={pet.situacao}
                localizacao={pet.localizacao}
                data={pet.data}
                imagem={pet.imagem}
                />
            ))}
            </div>
            </section>

            <section id="ajuda" className="ajuda">
                <h2>
                    <img src="/patanaranja.png" alt="" className="icone-menu" />
                    Precisa de ajuda?
                    </h2>

                <h3>Como utilizar o CarameloFinder?</h3>

                <ol>
                    <li>Procure um animal pelo nome ou localização.</li>
                    <li>Utilize as opções Perdidos e Encontrados para filtrar os relatos.</li>
                    <li>Compartilhe os relatos para ajudar os animais a reencontrarem suas famílias.</li>
                </ol>

            </section>

            <section className="redes-sociais">
                <h2 className="titulo-redes">
                    Compartilhe nossa causa.
                    <img src="/patas.png" alt="" className="icone-patitas"/>
                    </h2>
                <p>Ajude mais animais a reencontrarem suas famílias</p>

                <div className="icones-redes">
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.png" alt="Instagram" />
                    </a>

                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <img src="/facebook.png" alt="Facebook" />
                    </a>

                    <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                    <img src="/whatsapp.png" alt="WhatsApp" />
                    </a>

                </div>

            </section>
            <footer className="rodape">
                <p>
                    <img src="/patas.png" alt="" className="icone-rodape" />
                     CarameloFinder - Juntos encontramos lares!
                     <img src="/coracaorojo.png" alt="" className="icone-rodape" />
                     </p>
                <p>&copy; 2026 CarameloFinder. Projeto desenvolvido para o curso de Front End.</p>

            </footer>
    </main>
)
}
export default Home