import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { apiFetch } from '../../utils/api';
import { FaUsers, FaTimes } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { PaginatedResponse } from '../../types/Pagination';

interface Plano {
  id: number;
  nome: string;
  descricao: string;
  valor: string;
}

interface PlanoAtivo {
  id: number;
  aluno_nome: string;
}

export default function Planos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [form, setForm] = useState<Partial<Plano>>({ nome: '', descricao: '', valor: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [modalPlanoId, setModalPlanoId] = useState<number | null>(null);
  const [planosAtivosModal, setPlanosAtivosModal] = useState<PlanoAtivo[]>([]);

  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      const data = await apiFetch<PaginatedResponse<Plano>>('/planos');
      setPlanos(data.data);
    } catch (e) {
      console.error('Erro ao buscar planos:', e);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome?.trim()) return setError('Nome é obrigatório');

    try {
      if (editingId) {
        await apiFetch(`/planos/${editingId}`, form, 'PUT');
      } else {
        await apiFetch('/planos', form, 'POST');
      }
      resetForm();
      fetchPlanos();
    } catch (e) {
      setError('Erro ao salvar plano');
    }
  };

  const handleEdit = (plano: Plano) => {
    setForm({ nome: plano.nome, descricao: plano.descricao, valor: plano.valor });
    setEditingId(plano.id);
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este plano?')) return;
    try {
      await apiFetch(`/planos/${id}`, null, 'DELETE');
      fetchPlanos();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Erro ao excluir plano');
    }
  };

  const resetForm = () => {
    setForm({ nome: '', descricao: '', valor: '' });
    setEditingId(null);
    setError('');
  };

  const abrirModalPlanosAtivos = async (planoId: number) => {
    try {
      const data = await apiFetch<PlanoAtivo[]>(`/planos/${planoId}/planos-ativos`);
      setModalPlanoId(planoId);
      setPlanosAtivosModal(data);
    } catch (e) {
      console.error('Erro ao carregar planos ativos', e);
    }
  };

  const fecharModal = () => {
    setModalPlanoId(null);
    setPlanosAtivosModal([]);
  };

  return (
    <div className="p-6 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">
          {editingId ? 'Editar' : 'Novo'} Plano
        </h2>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={form.nome || ''}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            placeholder="Nome"
            className="flex-1 border rounded px-3 py-1.5 text-sm"
          />
          <input
            type="text"
            value={new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(form.valor || '0') / 100)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              setForm((f) => ({ ...f, valor: Number(raw) }));
            }}
            placeholder="Valor"
            className="flex-1 border rounded px-3 py-1.5 text-sm"
          />



        </div>

        <textarea
          value={form.descricao || ''}
          onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
          placeholder="Descrição"
          className="w-full border rounded px-3 py-1.5 text-sm resize-none"
          rows={2}
        />

        <div className="flex justify-center gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
          >
            {editingId ? 'Salvar' : 'Adicionar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-sm px-4 py-1.5 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {planos.length > 0 && planos.map((plano) => (
          <li key={plano.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{plano.nome}</p>
              <p className="text-sm text-gray-600">{plano.descricao}</p>
              <p className="text-sm text-gray-800">R$ {Math.floor(plano.valor / 100)},{String(plano.valor % 100).padStart(2, '0')}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => abrirModalPlanosAtivos(plano.id)}
                className="bg-transparent hover:bg-transparent"
                title="Ver Ativos"
              >
                <FaUsers color='black' size={25} />
              </Button>
              <Button
                onClick={() => handleEdit(plano)}
                className="text-white px-3 py-1 rounded"
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDelete(plano.id)}
                className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {modalPlanoId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Planos ativos</h3>
              <button onClick={fecharModal}>
                <FaTimes />
              </button>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {planosAtivosModal.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum aluno associado.</p>
              ) : (planosAtivosModal.length > 0 &&
                planosAtivosModal.map((aluno) => (
                  <li
                    key={aluno.id}
                    className="border p-2 rounded"
                  >
                    {aluno.aluno_nome}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
