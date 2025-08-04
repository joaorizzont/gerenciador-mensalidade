import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Aluno } from '../../types/Aluno';
import { apiFetch } from '../../utils/api';
import { PaginatedResponse } from '../../types/Pagination';
import { FaArrowLeft } from 'react-icons/fa';

interface Professor {
    id: number;
    nome: string;
    telefone?: string;
}

interface Plano {
    id: number;
    nome: string;
    valor: number
}

interface Grupo {
    id: number;
    nome: string;
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

export default function AlunoPerfil() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Aluno | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingAluno, setLoadingAluno] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [professorSelecionado, setProfessorSelecionado] = useState('');
    const [vencimentosAbertos, setVencimentosAbertos] = useState<Vencimento[]>([])
    const [vencimentosConcluidos, setVencimentosConcluidos] = useState<Vencimento[]>([])

    const [planos, setPlanos] = useState<Plano[]>([]);

    const [planoAtivoEdit, setPlanoAtivoEdit] = useState<{
        id?: number;
        plano_id: string;
        dia_vencimento: string;
        valor: number
    }>({
        plano_id: '',
        dia_vencimento: '',
        valor: 0
    });


    const [editandoPlanoAtivo, setEditandoPlanoAtivo] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAluno(Number(id));
            fetchProfessores();
            fetchPlanos();
        }
    }, [id]);


    useEffect(() => {
        if (formData?.planos_ativos.length > 0) {
            setPlanoAtivoEdit({
                id: formData.planos_ativos[0].id,
                plano_id: formData.planos_ativos[0].plano_id?.toString() || '',
                dia_vencimento: formData.planos_ativos[0].dia_vencimento?.toString() || '',
                valor: formData.planos_ativos[0]?.plano?.valor || 0,
            });
        } else {
            setPlanoAtivoEdit({ id: undefined, plano_id: '', dia_vencimento: '', valor: 0 });
        }
    }, [formData]);

    async function handleSalvarEdicaoPlanoAtivo() {
        if (!planoAtivoEdit.plano_id || !planoAtivoEdit.dia_vencimento) {
            setError('Preencha os campos obrigatórios do plano ativo.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            if (planoAtivoEdit.id) {
                await apiFetch(
                    `/planos-ativos/${planoAtivoEdit.id}`,
                    {
                        plano_id: Number(planoAtivoEdit.plano_id),
                        dia_vencimento: Number(planoAtivoEdit.dia_vencimento),
                    },
                    'PUT'
                );
            } else {

                await apiFetch(
                    `/planos-ativos`,
                    {
                        aluno_id: formData!.id,
                        plano_id: Number(planoAtivoEdit.plano_id),
                        dia_vencimento: Number(planoAtivoEdit.dia_vencimento),
                        valor: Number(planoAtivoEdit.valor),
                    },
                    'POST'
                );
            }
            await fetchAluno(formData!.id);
            setEditandoPlanoAtivo(false);
        } catch {
            setError('Erro ao salvar edição do plano ativo.');
        } finally {
            setLoading(false);
        }
    }

    async function fetchAluno(alunoId: number) {
        setLoadingAluno(true);
        setError(null);
        try {
            const aluno = await apiFetch<Aluno>(`/alunos/${alunoId}`);
            setProfessorSelecionado(aluno.professor_id?.toString() || '');
            setFormData(aluno);
            fetchVencimentos(aluno)
        } catch {
            setError('Erro ao carregar dados do aluno.');
        } finally {
            setLoadingAluno(false);
        }
    }

    async function fetchProfessores() {
        const data = await apiFetch<PaginatedResponse<Professor>>('/professores');
        setProfessores(data.data);
    }

    async function fetchPlanos() {
        const data = await apiFetch<PaginatedResponse<Plano>>('/planos');
        setPlanos(data.data);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSave() {
        if (!formData) return;
        setLoading(true);
        setError(null);
        try {
            await apiFetch<Aluno>(`/alunos/${formData.id}`, formData, 'PUT');
            navigate('/alunos');
        } catch {
            setError('Erro ao salvar aluno. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGerarCobrança() {
        if (!planoAtivoEdit) return;
        setLoading(true);
        setError(null);
        try {



            await apiFetch<Vencimento>(`/vencimentos/`, {
                'plano_id': planoAtivoEdit.id,
                'aluno_id': formData.id,
                'dia_vencimento': planoAtivoEdit.dia_vencimento,
                'valor': planoAtivoEdit.valor
            }, 'POST');
            fetchVencimentos(formData)
        } catch {
            setError('Erro ao carregar os vencimento');
        } finally {
            setLoading(false);
        }
    }

    async function handleDesativarPlano() {
        if (!planoAtivoEdit) return;
        setLoading(true);
        setError(null);
        try {
            await apiFetch<void>(`/planos-ativos/${planoAtivoEdit.id}`, null, 'DELETE');
            fetchAluno(Number(id))
        } catch {
            setError('Erro ao carregar os vencimento');
        } finally {
            setLoading(false);
        }
    }

    async function fetchVencimentos(aluno: Aluno) {
        setLoading(true);
        setError(null);
        try {
            const abertos = await apiFetch<Vencimento[]>(`/vencimentos/?aluno_id=${aluno.id}&pago=0`);
            const concluidos = await apiFetch<Vencimento[]>(`/vencimentos/?aluno_id=${aluno.id}&pago=1&cancelados=1`);

            setVencimentosAbertos(abertos);
            setVencimentosConcluidos(concluidos.reverse());
        } catch (e) {
            console.log(e)
            setError('Erro ao carregar os vencimento');
        } finally {
            setLoading(false);
        }
    }

    async function handleConcluirVencimento(vencimento: Vencimento) {
        const valorFormatado = `R$ ${Math.floor(vencimento.valor / 100)},${String(vencimento.valor % 100).padStart(2, '0')}`
        const confirmar = window.confirm(`Tem certeza que deseja concluir o vencimento de ${valorFormatado} para ${vencimento.aluno.nome}?`);
        if (!confirmar) return;

        setLoading(true);
        setError(null);
        try {
            await apiFetch<Vencimento>(`/vencimentos/${vencimento.id}/concluir`, null, 'POST');
            fetchVencimentos(formData)

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
            fetchVencimentos(formData)
        } catch (e) {
            console.log(e)
            setError('Erro ao cancelar o vencimento');
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



    if (loadingAluno) return <p className="p-4">Carregando dados do aluno...</p>;
    if (!formData) return <p className="p-4 text-red-500">Erro ao carregar o aluno.</p>;

    return (
        <div className="p-6 flex-wrap flex">
            <div className="mt-6 flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/dashboard/alunos')}
                    className="h-10 w-10 flex items-center justify-center hover:cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
                    title="Voltar"
                >
                    <FaArrowLeft />
                </button>
                <h3 className="text-2xl font-bold">Informações do Aluno</h3>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <section className="mb-8 w-full flex-col">
                <h4 className="text-lg font-semibold mb-4">Informações</h4>
                <div className="flex flex-wrap gap-4">
                    <label className="flex flex-col w-full sm:w-[48%]">
                        Nome:
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[48%]">
                        Professor:
                        <select
                            value={professorSelecionado}
                            name="professor_id"
                            onChange={(e) => {
                                setProfessorSelecionado(e.target.value);
                                handleChange(e);
                            }}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">Selecionar...</option>
                            {professores.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col w-full sm:w-[30%]">
                        RG:
                        <input
                            type="text"
                            name="rg"
                            value={formData.rg || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[30%]">
                        CPF:
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[36%]">
                        Data Nascimento:
                        <input
                            type="date"
                            name="data_nascimento"
                            value={formData.data_nascimento?.split('T')[0] || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[30%]">
                        Celular:
                        <input
                            type="text"
                            name="celular"
                            value={formData.celular || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[36%]">
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[30%]">
                        Cidade:
                        <input
                            type="text"
                            name="cidade"
                            value={formData.cidade || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full">
                        Endereço:
                        <input
                            type="text"
                            name="endereco"
                            value={formData.endereco || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>



                    <label className="flex flex-col w-full sm:w-[49%]">
                        Responsável:
                        <input
                            type="text"
                            name="responsavel"
                            value={formData.responsavel || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full sm:w-[49%]">
                        Telefone do Responsável:
                        <input
                            type="text"
                            name="responsavel_telefone"
                            value={formData.responsavel_telefone || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col w-full">
                        Observação:
                        <textarea
                            name="observacao"
                            value={formData.observacao || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 resize-none"
                            rows={3}
                        />
                    </label>
                </div>
                <div className="mt-6 flex justify-end gap-2">

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </section>

            <section className="mb-8 w-full md:w-[49%]">
                <h4 className="text-lg font-semibold mb-4">Plano Ativo</h4>
                <div className="p-4 border rounded bg-gray-50 max-w-md space-y-4">
                    <label className="flex flex-col">
                        Plano:
                        <select
                            value={planoAtivoEdit.plano_id}
                            onChange={(e) =>
                                setPlanoAtivoEdit({ ...planoAtivoEdit, plano_id: e.target.value })
                            }
                            className="border rounded px-3 py-2 mt-1"
                        >
                            <option value="">Selecione um plano</option>
                            {planos.map((plano) => (
                                <option key={plano.id} value={plano.id}>
                                    {plano.nome} - R${Math.floor(plano.valor / 100)},{String(plano.valor % 100).padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col w-[150px]">
                        Dia do vencimento:
                        <input
                            type="number"
                            min={1}
                            max={31}
                            value={planoAtivoEdit.dia_vencimento}
                            onChange={(e) =>
                                setPlanoAtivoEdit({ ...planoAtivoEdit, dia_vencimento: e.target.value })
                            }
                            className="border rounded px-3 py-2 mt-1"
                        />
                    </label>


                    <div className="flex flex-wrap justify-between">
                        <button
                            onClick={handleSalvarEdicaoPlanoAtivo}
                            disabled={loading}
                            className={`px-4 py-2 rounded hover:cursor-pointer text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}>
                            {loading ? 'Salvando...' : 'Atualizar Plano'}
                        </button>
                        <button
                            onClick={handleGerarCobrança}
                            disabled={loading}
                            className={`px-4 py-2 rounded hover:cursor-pointer text-black  bg-gray-300  hover:bg-gray-400'
                                }`}>
                            {'Gerar Cobrança'}
                        </button>
                        <button
                            onClick={handleDesativarPlano}
                            disabled={loading}
                            className={`px-4 py-2 mt-2 rounded hover:cursor-pointer text-white'
                                }`}>
                            {loading ? 'Salvando...' : 'Desativar Plano'}
                        </button>
                    </div>
                </div>

            </section>


            <section className="mb-8 w-full md:w-[49%]">
                <h4 className="text-lg font-semibold mb-4">Vencimentos Abertos</h4>
                <ul className="">
                    {vencimentosAbertos.length > 0 && vencimentosAbertos.map((vencimento, index) => (
                        <li
                            key={vencimento.id}
                            className={`flex justify-between items-center p-4 hover:bg-gray-200 ${index % 2 || "bg-gray-100"}`}
                        >
                            <div>
                                <p className="font-bold">{formatDate(vencimento.created_at)} - R${Math.floor(vencimento.valor / 100)},{String(vencimento.valor % 100).padStart(2, '0')}
                                </p>
                                <p className="text-sm text-gray-600">{vencimento.plano?.nome}</p>
                            </div>
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

                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-8 w-full">
                <h4 className="text-lg font-semibold mb-4">Histórico</h4>
                <div className={"w-full flex flex-wrap gap-2"}>
                    {vencimentosConcluidos.length > 0 && vencimentosConcluidos.map((vencimento, index) => (
                        <div
                            key={vencimento.id}
                            className={`flex w-full md:w-[49%] justify-between items-center p-4 hover:bg-gray-200 bg-gray-100`}
                        >
                            <div>
                                <p className="font-bold">{formatDate(vencimento.created_at)} - R${Math.floor(vencimento.valor / 100)},{String(vencimento.valor % 100).padStart(2, '0')}
                                </p>
                                <p className="text-sm text-gray-600">{vencimento.plano?.nome}</p>
                            </div>
                            <div className=" flex gap-2">
                                {vencimento?.data_pagamento ? <span className="bg-green-600 text-sm px-3 py-1 rounded-full flex flex-col items-center text-white">
                                    <span>Pago</span>
                                    <p className="text-sm text-white -mt-1">{formatDate(vencimento.data_pagamento)}</p>
                                </span> :
                                    <span
                                        key={id}
                                        className="bg-yellow-100 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                                    >
                                        Cancelado
                                    </span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>




        </div>
    );
}
