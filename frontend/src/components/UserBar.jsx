import { getUser } from "../services/auth";
import "../pages/CadastrarPet.css";

function UserBar({ page, onHome, onLogout }) {
  return (
    <div className="cp-bar">
      <p>Olá, {getUser()?.name || "Usuário"}!</p>

      <div className="cp-bar-actions">
        {page === "cadastrar" && (
          <button className="cp-btn-sec" onClick={onHome}>← Início</button>
        )}

        <button className="cp-btn" onClick={onLogout}>Sair</button>
      </div>
    </div>
  );
}

export default UserBar;