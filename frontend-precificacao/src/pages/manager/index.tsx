import { useEffect, useState } from "react";
import { api } from "../../api";
import { Header } from "../../components/Header";
interface Ingrediente {
  id?: string;
  name: string;
  costPrice: string;
  packageSize: string;
}

function Manager() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  // --- ESTADOS DO SISTEMA (INGREDIENTES) ---
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [nomeIngrediente, setNomeIngrediente] = useState("");
  const [custoIngrediente, setCustoIngrediente] = useState("");

  // 1. Verifica se já existe um token salvo quando a página carrega
  useEffect(() => {
    const token = localStorage.getItem("@Precificacao:token");
    if (token) {
      setEstaAutenticado(true);
      buscarIngredientes();
    }
  }, []);

  // --- FUNÇÃO DE LOGOUT ---
  function lidarComLogout() {
    localStorage.removeItem("@Precificacao:token");
    setEstaAutenticado(false);
    setIngredientes([]);
    setEmail("");
    setSenha("");
  }

  // --- REQUISIÇÕES DO SISTEMA ---
  function buscarIngredientes() {
    setCarregando(true);
    api
      .get("/ingredients")
      .then((response) => {
        setIngredientes(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar ingredientes:", error);
        setCarregando(false);
        if (error.response?.status === 401) {
          lidarComLogout();
        }
      });
  }

  function lidarComCadastro(event: React.FormEvent) {
    event.preventDefault();
    if (!nomeIngrediente || !custoIngrediente) return;

    api
      .post("/ingredients", {
        nome: nomeIngrediente,
        custo: Number(custoIngrediente),
      })
      .then(() => {
        setNomeIngrediente("");
        setCustoIngrediente("");
        buscarIngredientes();
      });
  }

  return (
    <div className="font-sans">
      <Header />
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Painel de Precificação 💰
          </h1>
          <button
            onClick={lidarComLogout}
            className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sair
          </button>
        </div>

        {/* Formulário de Cadastro */}
        <section className="mb-8 rounded-lg border border-gray-300 p-4 bg-white shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Cadastrar Novo Insumo
          </h3>
          <form onSubmit={lidarComCadastro} className="flex gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={nomeIngrediente}
              onChange={(e) => setNomeIngrediente(e.target.value)}
              className="flex-[2] rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Custo R$"
              value={custoIngrediente}
              onChange={(e) => setCustoIngrediente(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 text-xl font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              +
            </button>
          </form>
        </section>

        {/* Listagem */}
        <section className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            Seus Ingredientes
          </h3>

          {carregando && (
            <p className="text-gray-500 animate-pulse">Carregando...</p>
          )}

          <ul className="divide-y divide-gray-100">
            {ingredientes.map((ingrediente) => (
              <li
                key={ingrediente.id}
                className="py-2.5 text-gray-700 first:pt-0 last:pb-0"
              >
                <span className="font-medium text-gray-900">
                  {ingrediente.name}
                </span>
                {" — "}
                <span className="text-emerald-600 font-semibold">
                  R$ {ingrediente.costPrice}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Manager;
