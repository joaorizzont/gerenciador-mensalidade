import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

import AlunoFormModal from '../../components/AlunoFormModal';
import { Aluno } from '../../types/Aluno';
import { PaginatedResponse } from '../../types/Pagination';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';


export default function Alunos() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [lastPage, setLastPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [nomeBusca, setNomeBusca] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState('');

  useEffect(() => {
    fetchAlunos();
  }, [page, nomeBusca]);

  const fetchAlunos = async () => {
    try {
      const response = await apiFetch<PaginatedResponse<Aluno>>(
        `/alunos?page=${page}&nome=${encodeURIComponent(nomeBusca)}`
      );
      setAlunos(response.data);
      setLastPage(response.last_page);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleNomeBuscaChange = debounce((value: string) => {
    setPage(1);
    setNomeBusca(value);
  }, 500);

  const handleAddAluno = async (alunoData: Partial<Aluno>) => {
    if (!alunoData.nome || !alunoData.nome.trim()) {
      setErrorAdd('O nome é obrigatório');
      return;
    }
    setLoadingAdd(true);
    setErrorAdd('');
    try {
      await apiFetch('/alunos', alunoData, 'POST');
      setShowAddModal(false);
      fetchAlunos();
    } catch (err) {
      setErrorAdd('Erro ao adicionar aluno');
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="border border-gray-300 rounded px-3 py-2 flex-1"
            onChange={(e) => handleNomeBuscaChange(e.target.value)}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Adicionar Aluno
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {alunos.length > 0 ? (
            <ul className="">
              {alunos.map((aluno, index) => (
                <li
                  key={aluno.id}
                  className={`p-4 hover:bg-gray-200 cursor-pointer ${index%2 || "bg-gray-100"}`}
                  onClick={() => navigate(`/dashboard/alunos/${aluno.id}`)}
                >
                  {aluno.nome}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum aluno encontrado.</p>
          )}
        </div>
      </div>

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

      {showAddModal && (
        <AlunoFormModal
          onClose={() => {
            setShowAddModal(false);
            setErrorAdd('');
          }}
          onSave={handleAddAluno}
          loading={loadingAdd}
          error={errorAdd}
        />
      )}
    </div>
  );
}
