import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Aluno } from "../../types/Aluno";
import { apiFetch } from '../../utils/api';

interface Plano {
  id: number;
  nome: string;
  valor: number
}

interface Vencimento {
  plano_id: string,
  aluno_id: string,
  plano: Plano,
  aluno: Aluno,
  valor: number,
  updated_at: string,
  created_at: string,
  id: string
}

const statusOptions = [
  'Todos', 'Abertos', 'Concluidos', 'Cancelados'
]



export default function Vencimentos() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vencimentos, setVencimentos] = useState<Vencimento[]>([])
  const [vencimentosAbertos, setVencimentosAbertos] = useState<Vencimento[]>([])
  const [vencimentosConcluidos, setVencimentosConcluidos] = useState<Vencimento[]>([])
  const [status, setStatus] = useState('Abertos')


  useEffect(() => {
    fetchVencimentos();
  }, [status])

  async function fetchVencimentos() {
    setLoading(true);
    setError(null);
    try {
      let vencimentosAux = [];

      switch (status) {
        case 'Todos': vencimentosAux = await apiFetch<Vencimento[]>(`/vencimentos?todos=1`); break;
        case 'Abertos': vencimentosAux = await apiFetch<Vencimento[]>(`/vencimentos/?pago=0`); break;
        case 'Cancelados': vencimentosAux = await apiFetch<Vencimento[]>(`/vencimentos?cancelados=1`); break;
        case 'Concluidos': vencimentosAux = await apiFetch<Vencimento[]>(`/vencimentos/?pago=1`); break;
        default: return;
      }

      setVencimentos(vencimentosAux);
    } catch (e) {
      console.log(e)
      setError('Erro ao carregar os vencimento');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };



  async function handleConcluirVencimento(vencimento: Vencimento) {
    const valorFormatado = `R$ ${Math.floor(vencimento.valor / 100)},${String(vencimento.valor % 100).padStart(2, '0')}`
    const confirmar = window.confirm(`Tem certeza que deseja concluir o vencimento de ${valorFormatado} para ${vencimento.aluno.nome}?`);
    if (!confirmar) return;

    setLoading(true);
    setError(null);
    try {
      await apiFetch<Vencimento>(`/vencimentos/${vencimento.id}/concluir`, null, 'POST');
      fetchVencimentos()

    } catch {
      setError('Erro ao concluir o vencimento');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelarVencimento(vencimento: Vencimento) {
    const valorFormatado = `R$ ${Math.floor(vencimento.valor / 100)},${String(vencimento.valor % 100).padStart(2, '0')}`
    const confirmar = window.confirm(`Tem certeza que deseja CANCELAR o vencimento de ${valorFormatado} para ${vencimento.aluno.nome}?`);

    if (!confirmar) return;

    setLoading(true);
    setError(null);


    try {
      await apiFetch<Vencimento>(`/vencimentos/${vencimento.id}`, null, 'DELETE');
      fetchVencimentos()
    } catch (e) {
      console.log(e)
      setError('Erro ao cancelar o vencimento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="p-6 flex-wrap flex">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
        >
          {statusOptions.map((a, index) => (
            <option key={index} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className={"w-full flex flex-wrap gap-2"}>
        {vencimentos.length > 0 && vencimentos.map((vencimento, index) => (
          <div
            key={vencimento?.id}
            className={`flex w-full md:w-[49%] justify-between items-center p-4 hover:bg-gray-200 bg-gray-100`}
          >
            <div>
              <p className="font-bold">{vencimento?.aluno.nome}</p>
              <p className="text-sm text-gray-600">{formatDate(vencimento?.created_at)} - R${Math.floor(vencimento?.valor / 100)},{String(vencimento.valor % 100).padStart(2, '0')}
              </p>
              <p className="text-sm text-gray-600">{vencimento?.plano?.nome}</p>
            </div>
            {!(vencimento?.data_pagamento || vencimento?.deleted_at) &&
              <div className=" flex gap-2">
                <button
                  onClick={() => handleCancelarVencimento(vencimento)}
                  className="px-4 py-2 rounded bg-gray-300  hover:bg-gray-400 text-black hover:cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConcluirVencimento(vencimento)}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            }
            {(vencimento?.data_pagamento && !vencimento?.deleted_at) &&
              <div className="flex gap-2">
                <span className="bg-green-600 text-sm px-3 py-1 rounded-full flex flex-col items-center text-white">
                  <span>Pago</span>
                  <p className="text-sm text-white -mt-1">{formatDate(vencimento?.data_pagamento)}</p>
                </span>
              </div>}


            {(vencimento?.deleted_at) && <div className=" flex gap-2"> <span
              className="bg-yellow-100 text-sm px-3 py-1 rounded-full flex items-center gap-2"
            >
              Cancelado
            </span></div>}

          </div>
        ))}
      </div>

    </div>);
}
