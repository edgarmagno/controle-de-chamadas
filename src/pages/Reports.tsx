import React from 'react';
import { BarChart3, FileText, Download, CheckCircle2, Clock } from 'lucide-react';
import { useTickets } from '../lib/ticketService';
import { cn } from '../lib/utils';

export function Reports() {
  const { tickets } = useTickets();
  const completed = tickets.filter(t => t.status === 'completed');

  const calculateAverageTime = () => {
    if (completed.length === 0) return '0min';
    let totalMins = 0;
    completed.forEach(t => {
      const s = t.createdAt?.toDate?.() || new Date(t.createdAt);
      const e = t.updatedAt?.toDate?.() || new Date(t.updatedAt);
      totalMins += Math.floor((e.getTime() - s.getTime()) / 60000);
    });
    const avg = Math.floor(totalMins / completed.length);
    return avg < 60 ? `${avg}min` : `${Math.floor(avg / 60)}h ${avg % 60}m`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Relatórios Gerenciais</h1>
        <p className="text-[#64748b] font-medium text-sm">Análise de desempenho e produtividade</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <ReportCard title="Tempo Médio de Atendimento" value={calculateAverageTime()} icon={Clock} />
        <ReportCard title="Ocorrências Mensais" value={tickets.length.toString()} trend="Total" icon={FileText} />
        <ReportCard title="Concluídos com Sucesso" value={completed.length.toString()} icon={CheckCircle2} />
      </div>

      <div className="bg-white p-10 lg:p-20 rounded-3xl border border-[#e2e8f0] flex flex-col items-center justify-center text-center gap-4 shadow-sm">
        <div className="w-16 lg:w-20 h-16 lg:h-20 bg-slate-50 rounded-full flex items-center justify-center">
          <BarChart3 className="w-8 lg:w-10 text-slate-300" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-slate-900">Análise de Fluxo Otimizada</p>
          <p className="text-sm text-slate-500 max-w-md">O tempo de resposta é calculado desde o lançamento até a finalização pelo técnico ou camareira.</p>
        </div>
        <button className="mt-4 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
          <Download className="w-4 h-4" />
          <span>Exportar PDF Completo</span>
        </button>
      </div>
    </div>
  );
}

function ReportCard({ title, value, trend, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        {trend && (
          <span className="text-[10px] font-black px-2 py-1 rounded-full bg-slate-50 text-slate-500 uppercase">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
