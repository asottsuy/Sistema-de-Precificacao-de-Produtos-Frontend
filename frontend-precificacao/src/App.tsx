import { useEffect, useState } from "react";
import { api } from "./api";
import Home from "../src/pages/Home";

function App() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("@Precificacao:token");
    if (token) {
      setEstaAutenticado(true);
    }
  }, []);

  // --- FUNÇÃO DE LOGIN ---
  function lidarComLogin(event: React.FormEvent) {
    event.preventDefault();
    setErroLogin("");

    if (!email || !senha) {
      setErroLogin("Preencha todos os campos.");
      return;
    }

    api
      .post("/auth/login", { email, passwordHash: senha })
      .then((response) => {
        console.log("response: ", response);
        const token = response.data.token?.accessToken;
        console.log(token);

        if (token) {
          localStorage.setItem("@Precificacao:token", token);
          setEstaAutenticado(true);
        }
      })
      .catch((error) => {
        console.error("Erro no login:", error);
        setErroLogin("E-mail ou senha incorretos.");
      });
  }

  // --- FUNÇÃO DE LOGOUT ---
  function lidarComLogout() {
    localStorage.removeItem("@Precificacao:token");
    setEstaAutenticado(false);
    setEmail("");
    setSenha("");
  }

  if (!estaAutenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans p-4">
        <form
          onSubmit={lidarComLogin}
          className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Entrar no Sistema
          </h2>

          {erroLogin && (
            <p className="mb-4 text-sm text-red-500">{erroLogin}</p>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2.5 text-base font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  } else {
    return <Home logout={lidarComLogout} />;
  }
}

export default App;
