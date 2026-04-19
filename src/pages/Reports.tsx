import React from 'react';
import { BarChart3, FileText, Download } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Relatórios Gerenciais</h1>
        <p className="text-[#64748b] font-medium text-sm">Análise de desempenho e produtividade</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <ReportCard title="Tempo Médio de Atendimento" value="14min" trend="+2%" icon={BarChart3} />
        <ReportCard title="Ocorrências Mensais" value="124" trend="-5%" icon={FileText} />
        <ReportCard title="Eficiência da Equipe" value="98.2%" trend="+0.4%" icon={BarChart3} />
      </div>

      <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-slate-300" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-slate-900">Gráficos em Processamento</p>
          <p className="text-sm text-slate-500">Os dados de hoje estão sendo consolidados para o fechamento.</p>
        </div>
        <button className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
          <Download className="w-4 h-4" />
          <span>Exportar PDF</span>
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
        <span className={cn(
          "text-[10px] font-black px-2 py-1 rounded-full",
          trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>{trend}</span>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
