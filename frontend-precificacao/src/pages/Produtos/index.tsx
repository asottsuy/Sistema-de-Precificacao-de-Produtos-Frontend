import { useEffect, useState } from "react";
import { api } from "../../api";

interface Produto {
  id?: string;
  name: string;
  description: string;
  salePrice: number;
  items: ProdutoItem[];
}

export type ProdutoItem = {
  ingredientId: number;
  quantity: number;
  ingredientCostPrice?: number;
};

type Ingrediente = {
  id?: string;
  name: string;
  costPrice: number;
  unit: string;
  packageSize: number;
};

function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [produto, setProduto] = useState<Produto | undefined>(undefined);
  const [selectedItems, setSelectedItems] = useState<ProdutoItem[]>([]);
  const [editProduto, setEditProduto] = useState<Produto | undefined>(
    undefined,
  );
  const [idIngredienteSelecionado, setIdIngredienteSelecionado] =
    useState<string>("");

  // --- REQUISIÇÕES DO SISTEMA ---
  function buscarProdutos() {
    setCarregando(true);
    api
      .get("/products")
      .then((response) => {
        setProdutos(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar produto:", error);
        setCarregando(false);
      });
  }

  function criarProduto(event: React.FormEvent) {
    event.preventDefault();
    if (!produto) return;

    api
      .post("/products", {
        name: produto.name,
        description: produto.description,
        salePrice: produto.salePrice,
        items: produto.items,
      })
      .then(() => {
        setProduto(undefined);
        buscarProdutos();
      });
  }

  function salvarEdicao(event: React.FormEvent) {
    event.preventDefault();
    if (!editProduto || !editProduto.id) return;

    const dadosAtualizados = {
      name: editProduto?.name,
      description: editProduto?.description,
      items: editProduto?.items,
    };

    api
      .patch(`/products/${editProduto.id}`, dadosAtualizados)
      .then(() => {
        setEditProduto(undefined);
        buscarProdutos();
      })
      .catch((error) => {
        console.error("Erro ao atualizar os produtos:", error);
      });
  }

  function deletarProduto(id?: string) {
    if (!id) return;

    // Uma confirmação simples para o usuário não deletar sem querer
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    api
      .delete(`/products/${id}`)
      .then(() => {
        alert("produto deletado com sucesso!");
        buscarProdutos(); // Atualiza a lista na tela para sumir o item deletado
      })
      .catch((error) => {
        console.error("Erro ao deletar produto:", error);
        alert("Não foi possível deletar o produto.");
      });
  }

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
      });
  }

  useEffect(() => {
    buscarIngredientes();
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <section className="mb-8 rounded-lg border border-gray-300 p-4 bg-white shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Cadastrar Novo Produto
        </h3>
        <form onSubmit={criarProduto} className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={produto?.name || ""}
            onChange={(e) =>
              setProduto((prev) => ({
                name: e.target.value,
                description: prev?.description || "",
                salePrice: prev?.salePrice || 0,
                items: prev?.items || [],
              }))
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço de Venda R$"
            value={produto?.salePrice || ""}
            onChange={(e) =>
              setProduto((prev) => ({
                name: prev?.name || "",
                description: prev?.description || "",
                salePrice: Number(e.target.value),
                items: prev?.items || [],
              }))
            }
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={produto?.description || ""}
            onChange={(e) =>
              setProduto((prev) => ({
                name: prev?.name || "",
                description: e.target.value,
                salePrice: prev?.salePrice || 0,
                items: prev?.items || [],
              }))
            }
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {/* select de ingredientes */}
          <select
            value=""
            onChange={(e) => {
              const ingredienteId = e.target.value;

              const ingredienteEscolhido = ingredientes.find(
                (ing) => ing.id == ingredienteId,
              );
              if (!ingredienteEscolhido) return;

              // 3. Evita duplicados convertendo para número para bater com o ProdutoItem
              const idNum = Number(ingredienteEscolhido.id);
              const jaAdicionado = produto?.items?.some(
                (item) => item.ingredientId === idNum,
              );

              if (jaAdicionado) {
                alert("Este ingrediente já foi adicionado!");
                return;
              }

              // 4. Cria o item seguindo estritamente a tipagem ProdutoItem
              const novoItem: ProdutoItem = {
                ingredientId: idNum,
                quantity: 0,
              };

              console.log("novoItem: ", novoItem);

              setProduto((prev) => {
                if (!prev) {
                  return {
                    name: "",
                    description: "",
                    salePrice: 0,
                    items: [novoItem],
                  };
                }

                return {
                  ...prev,
                  items: [...(prev.items || []), novoItem],
                };
              });
            }}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecione um ingrediente para adicionar...
            </option>
            {ingredientes.map((ingrediente) => (
              <option key={ingrediente.id} value={ingrediente.id}>
                {ingrediente.name}
              </option>
            ))}
          </select>
          <div className="mt-4 space-y-2">
            {produto?.items?.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Nenhum ingrediente selecionado ainda.
              </p>
            ) : (
              produto?.items?.map((item, index) => {
                // Cruza o ID para descobrir os detalhes (nome e unidade) do ingrediente
                const dadosIngrediente = ingredientes.find(
                  (ing) => Number(ing.id) == item.ingredientId,
                );

                // Função auxiliar para atualizar a quantidade com segurança
                const atualizarQuantidade = (valor: number) => {
                  // Evita que a quantidade seja menor que zero
                  const novaQuantidade = Math.max(0, valor);

                  setProduto((prev) => {
                    if (!prev) return prev;
                    const novosItems = [...prev.items];
                    novosItems[index] = {
                      ...novosItems[index],
                      quantity: novaQuantidade,
                    };
                    return { ...prev, items: novosItems };
                  });
                };

                return (
                  <div
                    key={item.ingredientId}
                    className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-md border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    {/* 1. Visualização do Nome */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {dadosIngrediente?.name || "Ingrediente não encontrado"}
                      </p>
                      {/* <p className="text-xs text-gray-500">
                        Preço base: R$ {dadosIngrediente?.costPrice.toFixed(2)}{" "}
                        por {dadosIngrediente?.packageSize}
                        {dadosIngrediente?.unit}
                      </p> */}
                    </div>

                    {/* 2. Controles de Quantidade e Unidade */}
                    <div className="flex items-center gap-2">
                      {/* Botão de Diminuir (-) */}
                      <button
                        type="button"
                        onClick={() => atualizarQuantidade(item.quantity - 0.1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 active:bg-gray-200 font-bold transition-colors"
                      >
                        -
                      </button>

                      {/* Input Centralizado */}
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity === 0 ? "" : item.quantity}
                          placeholder="0"
                          onChange={(e) => {
                            const valorInput = e.target.value;
                            atualizarQuantidade(
                              valorInput === "" ? 0 : Number(valorInput),
                            );
                          }}
                          className="w-20 h-8 rounded-md border border-gray-300 text-center text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* Botão de Aumentar (+) */}
                      <button
                        type="button"
                        onClick={() => atualizarQuantidade(item.quantity + 0.1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 active:bg-gray-200 font-bold transition-colors"
                      >
                        +
                      </button>

                      {/* Badge de Unidade de Medida */}
                      <span className="text-sm font-medium text-gray-500 w-8 text-left ml-1">
                        {dadosIngrediente?.unit || "g"}
                      </span>
                    </div>

                    {/* 3. Botão de Remover */}
                    <button
                      type="button"
                      onClick={() => {
                        setProduto((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            items: prev.items.filter((_, i) => i !== index),
                          };
                        });
                      }}
                      className="text-red-500 hover:text-red-700 p-2 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
                      title="Remover ingrediente"
                    >
                      Remover
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 text-xl font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            +
          </button>
        </form>
      </section>

      {editProduto && (
        <section className="mb-8 rounded-lg border border-gray-300 p-4 bg-amber-100 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Editar Produto
          </h3>
          <form
            onSubmit={salvarEdicao}
            className="flex flex-col gap-4 mt-4 p-4 border border-amber-200 bg-amber-50/50 rounded-xl animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-800">
                Editando: <span className="underline">{editProduto.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setEditProduto(undefined)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
              >
                Cancelar Edição
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Campo: Nome do Produto */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bolo de Chocolate"
                  value={editProduto.name || ""}
                  onChange={(e) =>
                    setEditProduto((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Campo: Descrição */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bolo artesanal com cobertura de brigadeiro"
                  value={editProduto.description || ""}
                  onChange={(e) =>
                    setEditProduto((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Seção: Itens / Ingredientes do Produto */}
              <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3">
                <h4 className="mb-2 text-sm font-bold text-gray-700 border-b pb-1">
                  Ingredientes / Itens do Produto
                </h4>

                {editProduto.items && editProduto.items.length > 0 ? (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {editProduto.items.map((item, index) => {
                      const ingAtual = ingredientes.find(
                        (ingrediente) =>
                          Number(ingrediente.id) === item.ingredientId,
                      );
                      return (
                        <div
                          key={item.ingredientId || index}
                          className="flex items-center gap-2 justify-between bg-gray-50 p-2 rounded border border-gray-200"
                        >
                          {/* Nome do ingrediente (geralmente vindo de um relacionamento populado no backend, ex: item.ingredient.name) */}
                          <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                            {ingAtual?.name ||
                              ingAtual?.name ||
                              `Item #${index + 1}`}
                          </span>

                          {/* Input para editar a quantidade usada desse ingrediente no produto */}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.001"
                              placeholder="Qtd"
                              value={item.quantity || ""}
                              onChange={(e) => {
                                const novasQuantidades = [
                                  ...(editProduto.items || []),
                                ];
                                novasQuantidades[index] = {
                                  ...novasQuantidades[index],
                                  quantity: Number(e.target.value),
                                };
                                setEditProduto((prev) => ({
                                  ...prev!,
                                  items: novasQuantidades,
                                }));
                              }}
                              className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm text-gray-900 focus:border-amber-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-500 w-6">
                              {ingAtual?.unit || ingAtual?.unit || "un"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic py-2">
                    Nenhum ingrediente vinculado a este produto.
                  </p>
                )}
              </div>

              {/* Botão de Salvar */}
              <button
                type="submit"
                className="rounded-md bg-amber-600 py-2.5 px-5 text-sm font-bold text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-2 shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Listagem */}
      <section className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
        <div className="flex justify-between text-center">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            Seus Produtos
          </h3>

          <button
            type="submit"
            onClick={buscarProdutos}
            className="rounded-md bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Buscar Produtos
          </button>
        </div>

        {carregando && (
          <p className="text-gray-500 animate-pulse">Carregando...</p>
        )}
        <ul className="divide-y divide-gray-200 mt-6 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
          {produtos.map((produtoItem) => (
            <li
              key={produtoItem.id}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              {/* Lado Esquerdo: Nome e Detalhes do Pacote */}
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-900 text-base">
                  <span>• id:{produtoItem.id} </span>
                  <span className="font-semibold">{produtoItem.name}</span>
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                    Descrição: {produtoItem.description}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {produtoItem.items.map((ing, index) => {
                    const ingAtual = ingredientes.find(
                      (ingrediente) =>
                        Number(ingrediente.id) === ing.ingredientId,
                    );

                    return (
                      <span
                        key={ing.ingredientId} // Garante a performance e estabilidade do React
                        className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm"
                      >
                        {/* Nome do Ingrediente */}
                        <span className="text-slate-800 font-semibold">
                          {ingAtual?.name || "Ingrediente desconhecido"}
                        </span>

                        {/* Divisor minimalista */}
                        <span className="text-slate-300">•</span>

                        {/* Quantidade e Unidade formatadas */}
                        <span className="text-slate-500 font-normal">
                          {ing.quantity}
                          <span className="text-slate-400 font-medium ml-0.5">
                            {ingAtual?.unit || "g"}
                          </span>
                        </span>
                        <span className="text-slate-300">•</span>

                        {/* Quantidade e Unidade formatadas */}
                        <span className="text-slate-500 font-normal">
                          <span className="text-slate-400 font-medium ml-0.5">
                            R$
                          </span>
                          {produtoItem.items[index]?.ingredientCostPrice}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Lado Direito: Preço e Ações */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Preço de Venda
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    R${" "}
                    {produtoItem.salePrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Grupo de Botões de Ação */}
                <div className="flex items-center gap-1 border-l pl-3 border-gray-100">
                  {/* BOTÃO EDITAR */}
                  <button
                    onClick={() => setEditProduto(produtoItem)}
                    className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Editar produto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>

                  {/* BOTÃO EXCLUIR */}
                  <button
                    onClick={() => {
                      deletarProduto(produtoItem.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Excluir produto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Produtos;
