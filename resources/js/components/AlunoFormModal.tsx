import React, { useState, useEffect } from 'react';
import { Aluno } from '../types/Aluno';
import { apiFetch } from '../utils/api';
import { PaginatedResponse } from '../types/Pagination';

interface Professor {
    id: number;
    nome: string;
    telefone?: string;
}

interface AlunoFormModalProps {
    aluno?: Aluno;
    onClose: () => void;
    onSave: (aluno: Partial<Aluno>) => void;
    loading?: boolean;
    error?: string;
}

export default function AlunoFormModal({
    aluno,
    onClose,
    onSave,
    loading = false,
    error,
}: AlunoFormModalProps) {
    const [professores, setProfessores] = useState<[]>([]);


    const [formData, setFormData] = useState<Partial<Aluno>>({
        nome: aluno?.nome || '',
        professor_id: aluno?.professor_id || '',
        rg: aluno?.rg || '',
        cpf: aluno?.cpf || '',
        data_nascimento: aluno?.data_nascimento || '',
        endereco: aluno?.endereco || '',
        cidade: aluno?.cidade || '',
        celular: aluno?.celular || '',
        email: aluno?.email || '',
        responsavel: aluno?.responsavel || '',
        responsavel_telefone: aluno?.responsavel_telefone || '',
        observacao: aluno?.observacao || '',
    });

    useEffect(() => {
        fetchProfessores();
    }, []);


    async function fetchProfessores() {
        const data = await apiFetch<PaginatedResponse<Professor>>('/professores');
        setProfessores(data.data);
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center  z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-4">{aluno ? 'Editar Aluno' : 'Novo Aluno'}</h3>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="nome">Nome *</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome || ''}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <label className="flex flex-col w-full">
                        Professor:
                        <select
                            value={formData.professor_id ?? ''}
                            name="professor_id"
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">Selecionar...</option>
                            {professores.length > 0 && professores.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>
                    </label>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-1" htmlFor="rg">RG</label>
                            <input
                                type="text"
                                id="rg"
                                name="rg"
                                value={formData.rg || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-1" htmlFor="cpf">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={formData.cpf || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1" htmlFor="data_nascimento">Data Nascimento</label>
                        <input
                            type="date"
                            id="data_nascimento"
                            name="data_nascimento"
                            value={formData.data_nascimento || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-1" htmlFor="endereco">Endereço</label>
                            <input
                                type="text"
                                id="endereco"
                                name="endereco"
                                value={formData.endereco || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-1" htmlFor="cidade">Cidade</label>
                            <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                value={formData.cidade || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-1" htmlFor="celular">Celular</label>
                            <input
                                type="text"
                                id="celular"
                                name="celular"
                                value={formData.celular || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-1" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1" htmlFor="responsavel">Responsável</label>
                        <input
                            type="text"
                            id="responsavel"
                            name="responsavel"
                            value={formData.responsavel || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1" htmlFor="responsavel_telefone">Telefone do Responsável</label>
                        <input
                            type="text"
                            id="responsavel_telefone"
                            name="responsavel_telefone"
                            value={formData.responsavel_telefone || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1" htmlFor="observacao">Observação</label>
                        <textarea
                            id="observacao"
                            name="observacao"
                            value={formData.observacao || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
