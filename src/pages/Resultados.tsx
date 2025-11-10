import { useState } from "react";
import { PacienteApi, formatarTelefone, type DadosPaciente } from "../services/ApiNova";

export function Resultados() {
  const [telefone, setTelefone] = useState("");
  const [dados, setDados] = useState<DadosPaciente | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarDados() {
    if (!telefone.trim()) {
      setErro("Digite seu telefone");
      return;
    }

    setErro("");
    setCarregando(true);
    setDados(null);

    try {
      const resultado = await PacienteApi.buscarDadosPorTelefone(telefone);
      setDados(resultado);
      
      if (!resultado.encontrado) {
        setErro(resultado.mensagem || "Paciente não encontrado");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErro(msg || "Erro ao buscar dados");
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data: string): string {
    try {
      const d = new Date(data);
      return d.toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900 text-center">
          Meus Resultados
        </h1>

        {/* Busca por telefone */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Consultar Resultados
          </h2>
          <p className="text-slate-600 mb-6">
            Digite seu telefone para visualizar exames, receitas e prontuários
          </p>

          <div className="flex gap-4">
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 98765-4321"
              className="flex-1 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && buscarDados()}
            />
            <button
              onClick={buscarDados}
              disabled={carregando}
              className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-800 transition disabled:bg-gray-400"
            >
              {carregando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {erro && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-semibold">❌ {erro}</p>
            </div>
          )}
        </div>

        {/* Resultados */}
        {dados && dados.encontrado && dados.paciente && (
          <div className="space-y-6">
            {/* Dados do Paciente */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                👤 Dados do Paciente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Nome</p>
                  <p className="font-semibold text-slate-900">{dados.paciente.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Telefone</p>
                  <p className="font-semibold text-slate-900">{formatarTelefone(dados.paciente.telefone)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold text-slate-900">{dados.paciente.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Data de Nascimento</p>
                  <p className="font-semibold text-slate-900">
                    {formatarData(dados.paciente.dataNascimento)}
                  </p>
                </div>
              </div>
            </div>

            {/* Receitas */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                💊 Receitas Médicas
              </h2>

              {!dados.receitas || dados.receitas.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-lg">📋 Você não possui receitas cadastradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dados.receitas.map((receita) => (
                    <div
                      key={receita.id}
                      className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-slate-600">Emitida em</p>
                          <p className="font-bold text-slate-900">
                            {formatarData(receita.dataEmissao)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Médico</p>
                          <p className="font-semibold text-slate-900">{receita.medico}</p>
                          <p className="text-sm text-slate-500">{receita.especialidade}</p>
                        </div>
                      </div>

                      {receita.observacoes && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-slate-700">{receita.observacoes}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="font-semibold text-slate-800">Medicamentos:</p>
                        {receita.itens.map((item, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-blue-300">
                            <p className="font-medium text-slate-900">{item.medicamento}</p>
                            {item.dosagem && <p className="text-sm text-slate-600">Dosagem: {item.dosagem}</p>}
                            {item.frequencia && <p className="text-sm text-slate-600">Frequência: {item.frequencia}</p>}
                            {item.duracaoDias && <p className="text-sm text-slate-600">Duração: {item.duracaoDias} dias</p>}
                            {item.instrucoes && <p className="text-sm text-slate-500 italic">{item.instrucoes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prontuários/Laudos */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                📄 Prontuários e Laudos
              </h2>

              {!dados.prontuarios || dados.prontuarios.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-lg">📋 Você não possui prontuários cadastrados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dados.prontuarios.map((pront) => (
                    <div
                      key={pront.id}
                      className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-slate-600">Registro em</p>
                          <p className="font-bold text-slate-900">
                            {formatarData(pront.dataRegistro)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Médico</p>
                          <p className="font-semibold text-slate-900">{pront.medico}</p>
                          <p className="text-sm text-slate-500">{pront.especialidade}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-slate-700">{pront.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
