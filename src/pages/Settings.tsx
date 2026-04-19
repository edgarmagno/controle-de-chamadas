import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Configurações</h1>
        <p className="text-[#64748b] font-medium text-sm">Personalize sua experiência no HotelLink</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Section title="Perfil do Usuário" icon={User}>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Nome Completo</span>
                <p className="font-bold">{profile?.name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-slate-400">E-mail Corporativo</span>
                <p className="font-bold">{profile?.email}</p>
              </div>
            </div>
          </Section>

          <Section title="Notificações" icon={Bell}>
            <div className="space-y-4">
              <Toggle label="Notificações via Navegador" checked />
              <Toggle label="Alertas de Chamados Urgentes" checked />
              <Toggle label="Relatório Semanal por E-mail" />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Segurança" icon={Shield}>
             <div className="space-y-4">
               <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all">
                  Alterar Senha de Acesso
               </button>
               <button className="w-full text-left p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-all">
                  Solicitar Exclusão de Conta
               </button>
             </div>
          </Section>

          <Section title="Dispositivo Mobile" icon={Smartphone}>
             <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700 leading-relaxed">
                  Para uma melhor experiência no celular, salve este site como um aplicativo na sua tela de início.
                </p>
             </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
           <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, checked }: { label: string, checked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <div className={cn(
        "w-10 h-6 rounded-full relative transition-all cursor-pointer",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
          checked ? "right-1" : "left-1"
        )} />
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
