function SearchBar({ busqueda, setBusqueda }) {
    return (
        <div className="barra-busqueda">
            <img src="/lupas.png" alt="Lupa" />
            <input type="text"
            placeholder="Buscar por nome ou localização"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            />
        </div>
    )
}

export default SearchBar