
function Header({
  menuActivo,
  setMenuActivo,
  setFiltro,
  onLogin,
}) {
  const menuItems = [
    {
      label: "Início",
      href: "#",
      icon: "home",
      action: () => setFiltro("Todos"),
    },
    {
      label: "Perdidos",
      href: "#relatos",
      icon: "document",
      action: () => setFiltro("Perdidos"),
    },
    {
      label: "Encontrados",
      href: "#relatos",
      icon: "heart",
      action: () => setFiltro("Encontrados"),
    },
    {
      label: "Ajuda",
      href: "#ajuda",
      icon: "help",
    },
  ];

  function renderIcon(icon) {
    const commonProps = {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };

    switch (icon) {
      case "home":
        return (
          <svg {...commonProps}>
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v12h14V9" />
            <path d="M9 21v-7h6v7" />
          </svg>
        );

      case "document":
        return (
          <svg {...commonProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
          </svg>
        );

      case "heart":
        return (
          <svg {...commonProps}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        );

      case "help":
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.1 1-2 1.4-2 3" />
            <path d="M12 17h.01" />
          </svg>
        );

      default:
        return null;
    }
  }

  return (
    <header className="cabecalho-home">
      <a
        href="#"
        className="marca-caramelo"
        onClick={() => {
          setMenuActivo("Início");
          setFiltro("Todos");
        }}
      >
        <img src="/caramelofinder-logo.png" alt="" />
        <span>
          Caramelo<span>Finder</span>
        </span>
      </a>

      <nav className="menu-home" aria-label="Navegação principal">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={menuActivo === item.label ? "ativo" : ""}
            aria-current={
              menuActivo === item.label ? "page" : undefined
            }
            onClick={() => {
              setMenuActivo(item.label);
              item.action?.();
            }}
          >
            <span className="icone-menu">
              {renderIcon(item.icon)}
            </span>

            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="botao-entrar"
        onClick={onLogin}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
        </svg>
        Entrar
      </button>
    </header>
  );
}

export default Header;
