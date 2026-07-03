import React, { useEffect, useState } from "react";
import { api } from "../../api";

interface IndicadoresProduto {
  productName: string;
  salePrice: number;
  indicators: {
    totalCost: number;
    contributionMargin: string;
    markup: string;
    profitMarginPercentage: string;
  };
  isProfitable: boolean;
}

export function PainelIndicadores() {
  const [produtos, setProdutos] = useState<IndicadoresProduto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function carregarPainelCompleto() {
      setLoading(true);

      // 1. Busca todos os produtos cadastrados
      api
        .get("/products")
        .then((response) => {
          const listaProdutos = response.data;

          // 2. Cria um array de requisições para buscar os indicadores de cada ID
          const promessas = listaProdutos.map((produto: any) =>
            api
              .get(`/products/${produto.id}/indicators`)
              .then((res) => res.data),
          );

          // 3. Resolve todas em paralelo
          Promise.all(promessas)
            .then((todosOsIndicadores) => {
              setProdutos(todosOsIndicadores);
              setLoading(false);
            })
            .catch((error) => {
              console.error(
                "Erro ao processar indicadores dos produtos:",
                error,
              );
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Erro ao buscar lista base de produtos:", error);
          setLoading(false);
        });
    }

    carregarPainelCompleto();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-600 min-h-screen">
        <span className="animate-pulse font-medium">
          Carregando indicadores financeiros...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Indicadores de Precificação
        </h2>
        <p className="text-sm text-gray-500">
          Análise de saúde financeira por produto
        </p>
      </header>

      {/* Grid Responsivo para os Cards */}
      <div className="grid grid-cols-1 gap-6">
        {produtos.map((prod, index) => (
          <div
            key={index}
            className={`rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
              prod.isProfitable ? "border-green-200" : "border-red-200"
            }`}
          >
            {/* Cabeçalho do Card */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3
                  className="font-bold text-gray-800 text-lg truncate"
                  title={prod.productName}
                >
                  {prod.productName}
                </h3>
                {/* Badge de Lucro/Prejuízo */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                    prod.isProfitable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {prod.isProfitable ? "Lucrativo" : "Prejuízo"}
                </span>
              </div>

              {/* Preço de Venda Principal */}
              <div className="mb-4 bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Preço de Venda:
                </span>
                <span className="text-xl font-black text-gray-900">
                  R$ {prod.salePrice.toFixed(2)}
                </span>
              </div>

              {/* Grid Interno de Indicadores */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border-b border-gray-100 pb-2">
                  <span className="block text-xs text-gray-400 font-medium">
                    Custo Total
                  </span>
                  <span className="font-semibold text-gray-700">
                    R$ {prod.indicators.totalCost.toFixed(2)}
                  </span>
                </div>

                <div className="border-b border-gray-100 pb-2">
                  <span className="block text-xs text-gray-400 font-medium">
                    Margem Contrib.
                  </span>
                  <span
                    className={`font-semibold ${
                      Number(prod.indicators.contributionMargin) >= 0
                        ? "text-gray-700"
                        : "text-red-600"
                    }`}
                  >
                    R$ {prod.indicators.contributionMargin}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-gray-400 font-medium">
                    Markup
                  </span>
                  <span className="font-semibold text-gray-700">
                    {prod.indicators.markup}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-gray-400 font-medium">
                    Margem de Lucro
                  </span>
                  <span
                    className={`font-bold ${
                      prod.isProfitable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {prod.indicators.profitMarginPercentage}
                  </span>
                </div>
              </div>
            </div>

            {/* Rodapé dinâmico baseado no status do produto */}
            {!prod.isProfitable && (
              <div className="mt-4 pt-3 border-t border-red-100 text-right">
                <button className="text-xs font-bold text-red-600 hover:underline">
                  Ajustar Margens →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
