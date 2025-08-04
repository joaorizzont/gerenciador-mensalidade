import { useEffect, useState } from 'react';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { apiFetch } from '../../utils/api';

type RelatorioDados = {
  alunos: number;
  planos_ativos: number;
  vencimentos_abertos: number;
  pagamentos_por_mes: {
    mes: string;
    valor_pago: number;
  }[];
};

export default function DashboardHome() {
  const [dados, setDados] = useState<RelatorioDados | null>(null);

  useEffect(() => {
    apiFetch<RelatorioDados>('/relatorios/dados')
      .then(setDados)
      .catch((err) => {
        console.error('Erro ao buscar dados do relatório:', err);
      });
  }, []);

  return (
    <div className="p-6 text-black space-y-8">
      <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard!</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card label="Alunos cadastrados" value={dados?.alunos} />
        <Card label="Planos ativos" value={dados?.planos_ativos} />
        <Card label="Vencimentos em aberto" value={dados?.vencimentos_abertos} />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Pagamentos nos últimos 6 meses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados?.pagamentos_por_mes || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor_pago" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value?: number }) {
  return (
    <div className="bg-gray-200 shadow p-6 text-center">
      <div className="text-gray-600 text-sm">{label}</div>
      <div className="text-2xl font-bold mt-2">{value ?? '...'}</div>
    </div>
  );
}
