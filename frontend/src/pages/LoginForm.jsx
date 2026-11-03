import { useState } from "react";
import { login, register } from "../services/auth";

export default function LoginForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await login({ email: form.email, password: form.password });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>

      {mode === "register" && (
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
      )}
      <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Senha (mínimo 6)" value={form.password} onChange={handleChange} required />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
      </button>
      <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
        {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
      </button>
    </form>
  );
}