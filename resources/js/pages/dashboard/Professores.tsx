import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';
import { PaginatedResponse } from '../../types/Pagination';
import Button from '../../components/ui/Button';

interface Atividade {
  id: number;
  nome: string;
}

interface Professor {
  id: number;
  nome: string;
  telefone?: string;
  atividades?: Atividade[];
}

export default function Professores() {
  const [professores, setProfessores] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [form, setForm] = useState({ nome: '', telefone: '', atividades_ids: [] });
  const [editingId, setEditingId] = useState(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState('');
  const [error, setError] = useState('');
  const [nomeBusca, setNomeBusca] = useState("");
  const [atividadeFiltro, setAtividadeFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchAtividades();
  }, []);

  useEffect(() => {
    fetchProfessores();
  }, [nomeBusca, atividadeFiltro, page]);

  const fetchProfessores = async () => {
    const query = new URLSearchParams();
    if (nomeBusca) query.append("nome", nomeBusca);
    if (atividadeFiltro) query.append("atividades_ids", atividadeFiltro);
    const data = await apiFetch<PaginatedResponse<Professor>>(`/professores?${query.toString()}`);
    setProfessores(data.data);
  };

  const fetchAtividades = async () => {
    const data = await apiFetch<Atividade[]>('/atividades');
    setAtividades(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/professores/${editingId}` : '/professores';

    await apiFetch<Professor>(url, form, method);

    resetForm()
    fetchProfessores();
  };

  const handleEdit = (prof) => {
    setForm({
      nome: prof.nome,
      telefone: prof.telefone,
      atividades_ids: prof.atividades.map((a) => a.id),
    });
    setEditingId(prof.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja excluir este professor?')) return;
    await apiFetch(`/professores/${id}`, null, 'DELETE');
    fetchProfessores();
  };

  const resetForm = () => {
    setForm({ nome: '', telefone: '', atividades_ids: [] });
    setEditingId(null);
    setError('');
    setAtividadeSelecionada('');
  };

  const adicionarAtividade = (atv) => {
    const id = parseInt(atv);
    if (id && !form.atividades_ids.includes(id)) {
      setForm(f => ({
        ...f,
        atividades_ids: [...f.atividades_ids, id],
      }));
    }
    setAtividadeSelecionada('');
  };

  const removerAtividade = (id) => {
    setForm(f => ({
      ...f,
      atividades_ids: f.atividades_ids.filter(aId => aId !== id),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow md:max-w-[50%] mx-auto space-y-4"
      >
        <h2 className="text-lg font-semibold text-center mb-4">
          {editingId ? 'Editar' : 'Novo'} Professor
        </h2>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm(f => ({ ...f, telefone: e.target.value }))}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <Button
            type="submit"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Salvar' : 'Adicionar'}
          </Button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-2 items-center">
          <select
            value={atividadeSelecionada}
            onChange={(e) => adicionarAtividade(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
          >
            <option value="">Selecionar atividade...</option>
            {atividades
              .filter(a => !form.atividades_ids.includes(a.id))
              .map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {form.atividades_ids.map((id) => {
            const atividade = atividades.find((a) => a.id === id);
            return (
              <span
                key={id}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {atividade?.nome || 'Atividade'}
                <button
                  type="button"
                  onClick={() => removerAtividade(id)}
                  className="text-blue-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </form>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={nomeBusca}
          onChange={(e) => {
            setPage(1);
            setNomeBusca(e.target.value);
          }}
          className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <select
          value={atividadeFiltro}
          onChange={(e) => {
            setPage(1);
            setAtividadeFiltro(e.target.value);
          }}
          className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Todas as atividades</option>
          {atividades.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-lg font-semibold mb-2">Professores</h2>
      <ul className="space-y-2">
        {professores.map((professor) => (
          <li key={professor.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{professor.nome}</p>
              <p className="text-sm text-gray-600">{professor.descricao}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {professor.atividades.map((atv, id) => {
                  return (
                    <span
                      key={id}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {atv?.nome || 'Atividade'}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => handleEdit(professor)}
                className="text-white px-3 py-1 rounded"
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDelete(professor.id)}
                className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center text-gray-700">
          Página {page} de {lastPage}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
          disabled={page === lastPage}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
