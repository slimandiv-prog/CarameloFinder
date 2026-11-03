function Header({ menuActivo, setMenuActivo, setFiltro}) {
    return (

        <nav className="menu-home">

            <a href="#" onClick={() => {
            setMenuActivo("Início");
            setFiltro("Todos");
            }}

            className={menuActivo === "Início" ? "ativo" : ""} >
                <img src="/casa.png" alt="" className="icone-menu" />

                Início </a>

            <a href="#relatos"
            onClick={() => {
                setMenuActivo("Perdidos");
                setFiltro("Perdidos");
            }}

            className={menuActivo === "Perdidos" ? "ativo" : ""} >
            <img src="/documento.png" alt="" className="icone-menu" />

            Perdidos </a>


             <a href="#relatos"
            onClick={() => {
                setMenuActivo("Encontrados");
                setFiltro("Encontrados");
            }}

            className={menuActivo === "Encontrados" ? "ativo" : ""} >
            <img src="/coracao.png" alt="" className="icone-menu" />

            Encontrados </a>

             <a href="#ajuda"
            onClick={() => {
                setMenuActivo("Ajuda");
            }}

            className={menuActivo === "Ajuda" ? "ativo" : ""} >
            <img src="/ajuda.png" alt="" className="icone-menu" />

            Ajuda </a>

        </nav>

    )
}

export default Header