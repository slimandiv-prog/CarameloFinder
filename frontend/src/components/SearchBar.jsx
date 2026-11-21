
function SearchBar({ busqueda, setBusqueda }) {
  return (
    <div className="barra-busqueda">
      <img src="/lupas.png" alt="" aria-hidden="true" />

      <input
        type="search"
        aria-label="Buscar animais por nome ou localização"
        placeholder="Buscar por nome ou localização..."
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />

      {busqueda && (
        <button
          type="button"
          className="limpar-busca"
          aria-label="Limpar busca"
          onClick={() => setBusqueda("")}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;
