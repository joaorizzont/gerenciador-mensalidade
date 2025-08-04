import { useEffect, useState, FormEvent } from 'react';
import { apiFetch } from '../../utils/api';
import { FaUser, FaTimes } from 'react-icons/fa';
import Button from '../../components/ui/Button';

interface Atividade {
  id: number;
  nome: string;
  descricao: string;
}

interface Professor {
  id: number;
  nome: string;
}

export default function Atividades() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [form, setForm] = useState<Partial<Atividade>>({ nome: '', descricao: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [professoresModal, setProfessoresModal] = useState<Professor[]>([]);
  const [modalAtividadeId, setModalAtividadeId] = useState<number | null>(null);

  useEffect(() => {
    fetchAtividades();
  }, []);

  const fetchAtividades = async () => {
    try {
      const data = await apiFetch<Atividade[]>('/atividades');
      setAtividades(data);
    } catch (e) {
      console.error('Erro ao buscar atividades:', e);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome?.trim()) return setError('Nome é obrigatório');

    try {
      if (editingId) {
        await apiFetch(`/atividades/${editingId}`, form, 'PUT');
      } else {
        await apiFetch('/atividades', form, 'POST');
      }
      resetForm();
      fetchAtividades();
    } catch (e) {
      setError('Erro ao salvar atividade');
    }
  };

  const handleEdit = (atividade: Atividade) => {
    setForm({ nome: atividade.nome, descricao: atividade.descricao });
    setEditingId(atividade.id);
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta atividade?')) return;
    try {
      await apiFetch(`/atividades/${id}`, null, 'DELETE');
      fetchAtividades();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Erro ao excluir atividade');
    }
  };

  const resetForm = () => {
    setForm({ nome: '', descricao: '' });
    setEditingId(null);
    setError('');
  };

  const abrirModalProfessores = async (atividadeId: number) => {
    try {
      const data = await apiFetch<Professor[]>(`/atividades/${atividadeId}/professores`);
      setProfessoresModal(data);
      setModalAtividadeId(atividadeId);
    } catch (e) {
      console.error('Erro ao carregar professores', e);
    }
  };

  const desassociarProfessor = async (professorId: number) => {
    if (!modalAtividadeId) return;
    try {
      await apiFetch(`/atividades/${modalAtividadeId}/professores/${professorId}`, null, 'DELETE');
      setProfessoresModal((prev) => prev.filter(p => p.id !== professorId));
    } catch (e) {
      console.error('Erro ao desassociar professor');
    }
  };

  const fecharModal = () => {
    setModalAtividadeId(null);
    setProfessoresModal([]);
  };

  return (
    <div className="p-6 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">
          {editingId ? 'Editar' : 'Nova'} Atividade
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
          <textarea
            value={form.descricao || ''}
            onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            placeholder="Descrição"
            className="flex-1 border rounded px-3 py-1.5 text-sm resize-none"
            rows={1}
          />
        </div>

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
        {atividades.map((atividade) => (
          <li key={atividade.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{atividade.nome}</p>
              <p className="text-sm text-gray-600">{atividade.descricao}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => abrirModalProfessores(atividade.id)}
                className="bg-transparent hover:bg-transparent"
                title="Ver Professores"
              >
                <FaUser color='black' size={25} />
              </Button>
              <Button
                onClick={() => handleEdit(atividade)}
                className="text-white px-3 py-1 rounded"
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDelete(atividade.id)}
                className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {modalAtividadeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Professores Associados</h3>
              <button onClick={fecharModal}>
                <FaTimes />
              </button>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {professoresModal.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum professor associado.</p>
              ) : (
                professoresModal.map((prof) => (
                  <li
                    key={prof.id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>{prof.nome}</span>
                    <button
                      onClick={() => desassociarProfessor(prof.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                    </button>
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
