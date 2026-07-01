import { Header } from "../components/Header";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Ingredientes from "./Ingredientes";
import Produtos from "./Produtos";

interface HomeProps {
  logout: () => void;
}

function Home({ logout }: HomeProps) {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <Header />
        <main>
          <div className="mx-auto max-w-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Painel de Precificação 💰
              </h1>
              <button
                onClick={logout}
                className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sair
              </button>
            </div>
            {/* O Router decide qual componente renderizar baseado na URL atual */}
            <Routes>
              <Route path="/ingredientes" element={<Ingredientes />} />
              <Route path="/produtos" element={<Produtos />} />
              {/* Rota padrão caso acesse a raiz / */}
              <Route path="*" element={<Ingredientes />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Home;
