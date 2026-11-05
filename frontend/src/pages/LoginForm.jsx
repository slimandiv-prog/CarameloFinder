import { useState } from "react";
import { login, register } from "../services/auth";
import "./LoginForm.css";

export default function LoginForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") await register(form);

      await login({
        email: form.email,
        password: form.password
      });

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>

        <div className="login-header">
          <h2>{mode === "login" ? "Bem-vindo de volta!" : "Criar conta"}</h2>
          <p>
            {mode === "login"
              ? "Entre na sua conta para continuar."
              : "Cadastre-se e ajude animais a encontrarem suas famílias."}
          </p>
        </div>

        {mode === "register" && (
          <div className="login-group">
            <label>Nome</label>
            <input
              name="name"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="login-group">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="seuemail@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-group">
          <label>Senha</label>
          <input
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="login-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Aguarde..."
            : mode === "login"
            ? "Entrar"
            : "Cadastrar"}
        </button>

        <div className="login-footer">
          <span>
            {mode === "login"
              ? "Não tem conta?"
              : "Já tem conta?"}
          </span>

          <button
            type="button"
            className="login-toggle"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </div>

      </form>
    </div>
  );
}
