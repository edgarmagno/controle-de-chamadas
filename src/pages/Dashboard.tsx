import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets, createTicket, updateTicketStatus } from '../lib/ticketService';
import { Ticket, UserRole, Department, TicketPriority } from '../types';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Sparkles,
  ChevronRight,
  Filter,
  User as UserIcon,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const deptFilter = searchParams.get('dept') as Department | null;
  
  const effectiveRole = profile?.role !== 'reception' ? (profile?.role as Department) : (deptFilter || undefined);
  const { tickets, loading } = useTickets(effectiveRole);
  const [showModal, setShowModal] = useState(false);

  if (!profile) return null;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.role === 'reception' 
              ? (deptFilter ? `Fila: ${deptFilter === 'governance' ? 'Governança' : 'Manutenção'}` : 'Painel de Controle') 
              : profile.role === 'governance' ? 'Fila da Governança' : 'Fila da Manutenção'}
          </h1>
          <p className="text-gray-500 text-sm">
            {profile.role === 'reception' ? 'Gerencie todos os chamados ativos.' : 'Visualize e atenda seus chamados.'}
          </p>
        </div>
        
        {profile.role === 'reception' && (
          <button 
            onClick={() => setShowModal(true)}
            className="h-12 w-12 md:w-auto md:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline font-bold">Novo Chamado</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          label="Chamados Ativos" 
          value={tickets.filter(t => t.status !== 'completed').length} 
          color="#0f172a"
        />
        <StatCard 
          label="Governança" 
          value={tickets.filter(t => t.department === 'governance' && t.status !== 'completed').length} 
          color="#2563eb"
        />
        <StatCard 
          label="Manutenção" 
          value={tickets.filter(t => t.department === 'maintenance' && t.status !== 'completed').length} 
          color="#f59e0b"
        />
        <StatCard 
          label="Concluídos Hoje" 
          value={tickets.filter(t => t.status === 'completed').length} 
          color="#10b981"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Chamados Recentes</span>
          <button className="text-blue-600 p-1">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             <p className="text-sm">Carregando chamados...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Nenhum chamado pendente</p>
              <p className="text-sm text-gray-500">Tudo em ordem por enquanto!</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence initial={false}>
              {tickets.map((ticket) => (
                <TicketItem 
                  key={ticket.id} 
                  ticket={ticket} 
                  role={profile.role}
                  onUpdateStatus={(status) => updateTicketStatus(ticket.id, status, profile.name)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <TicketModal 
            onClose={() => setShowModal(false)} 
            onSubmit={async (data) => {
              await createTicket({
                ...data,
                openedBy: profile.uid,
              });
              setShowModal(false);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color?: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#64748b] mb-1">{label}</p>
      <p className={cn("text-2xl font-black", color ? `text-[${color}]` : "text-[#0f172a]")} style={{ color }}>{value}</p>
    </div>
  );
}

function TicketItem({ ticket, role, onUpdateStatus }: any) {
  const isReception = role === 'reception';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white border-b border-[#e2e8f0] px-4 lg:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-slate-50/50 transition-all first:rounded-t-xl last:rounded-b-xl last:border-b-0"
    >
      <div className="flex items-start lg:items-center gap-4 lg:gap-6 flex-1">
        <div className="w-10 lg:w-12 h-10 lg:h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
          <span className="font-black text-slate-800 text-sm lg:text-base">#{ticket.roomNumber}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm lg:text-base truncate">{ticket.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
             <span className={cn(
               "badge text-[9px] lg:text-[10px]",
               ticket.department === 'governance' ? "badge-governance" : "badge-maintenance"
             )}>
               {ticket.department === 'governance' ? 'Governança' : 'Manutenção'}
             </span>
             {ticket.priority === 'urgent' && <span className="badge badge-urgent text-[9px] lg:text-[10px]">Urgente</span>}
             <div className="flex items-center gap-1.5 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(ticket.createdAt?.toDate?.() || ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 mt-2 lg:mt-0">
        <div className="flex items-center gap-2 px-1 lg:px-0">
           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
             {(ticket.assignedTo || 'AP')[0]}
           </div>
           <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[100px]">
             {ticket.assignedTo || 'Aguardando'}
           </span>
        </div>

        <div className="flex items-center gap-3">
          {ticket.status === 'open' && !isReception && (
            <button 
              onClick={() => onUpdateStatus('in-progress')}
              className="flex-1 lg:flex-none px-6 py-2.5 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Atender
            </button>
          )}
          {ticket.status === 'in-progress' && !isReception && (
            <button 
               onClick={() => onUpdateStatus('completed')}
               className="flex-1 lg:flex-none px-6 py-2.5 bg-[#10b981] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Concluir
            </button>
          )}
          <div className={cn(
            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2",
            ticket.status === 'completed' ? "text-emerald-500" : "text-blue-500"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", ticket.status === 'completed' ? "bg-emerald-500" : "bg-blue-500 animate-pulse")} />
            {ticket.status === 'open' ? 'Pendente' : ticket.status === 'in-progress' ? 'Executando' : 'Finalizado'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TicketModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    department: 'governance' as Department,
    priority: 'medium' as TicketPriority,
    description: ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg p-6 lg:p-10 rounded-[32px] border border-[#e2e8f0] relative z-10 shadow-2xl space-y-6 lg:space-y-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Nova Ordem</h2>
            <p className="text-xs text-[#64748b] font-bold uppercase tracking-widest">Preencha os detalhes do serviço</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
             <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Nº Quarto</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={formData.roomNumber}
                  onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                  placeholder="Ex: 302"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Prioridade</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
                className="w-full px-4 py-3 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-bold text-slate-900"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Setor Designado</label>
            <div className="grid grid-cols-2 gap-4">
              {(['governance', 'maintenance'] as Department[]).map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setFormData({...formData, department: dept})}
                  className={cn(
                    "p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                    formData.department === dept ? "border-blue-600 bg-blue-50/50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  )}
                >
                  {dept === 'governance' ? <Sparkles className="w-6 h-6 text-emerald-600" /> : <Wrench className="w-6 h-6 text-blue-600" />}
                  <span className="text-[11px] font-black uppercase tracking-widest">{dept === 'governance' ? 'Governança' : 'Manutenção'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Descrição</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="O que precisa ser verificado?"
              className="w-full px-5 py-4 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none font-medium text-slate-900"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full h-16 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
              Confirmar Abertura
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
