import React from 'react';
import { LogOut, Hotel, LayoutDashboard, Sparkles, Wrench, Settings, FileText, House } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { NavLink, Link } from 'react-router-dom';
import { NotificationManager } from './NotificationManager';

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();

  const NavItem = ({ icon: Icon, label, to }: { icon: any, label: string, to: string }) => (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all",
        isActive 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-[#0f172a] p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">HotelLink</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="Painel Central" to="/" />
          {/* Note: In this simple demo, Gov and Maint could be filters on the dashboard, but for now we link to specific lists if needed, or just Dashboard */}
          <NavItem icon={Sparkles} label="Governança" to="/?dept=governance" />
          <NavItem icon={Wrench} label="Manutenção" to="/?dept=maintenance" />
          <NavItem icon={House} label="Quartos" to="/rooms" />
          <NavItem icon={FileText} label="Relatórios" to="/reports" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <NavItem icon={Settings} label="Configurações" to="/settings" />
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg text-sm font-medium transition-all mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-[#e2e8f0] px-4 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#0f172a] font-extrabold text-lg tracking-tight">HotelLink</span>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-[#0f172a]">Central de Chamadas</h2>
            <p className="text-xs text-[#64748b] font-medium uppercase tracking-wider">Gerenciamento operacional em tempo real</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-sm font-bold text-[#0f172a]">{profile?.name}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748b]">
                {profile?.role === 'reception' ? 'Recepção' : 
                 profile?.role === 'governance' ? 'Governança' : 'Manutenção'}
              </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden">
               {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?' }
            </div>
            
            <button 
              onClick={() => logout()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        <NotificationManager />

        {/* Bottom Navigation - Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-[#e2e8f0] px-6 flex items-center justify-between z-40 bg-white/80 backdrop-blur-lg">
          <MobileNavItem icon={LayoutDashboard} to="/" />
          <MobileNavItem icon={Sparkles} to="/?dept=governance" />
          <MobileNavItem icon={Wrench} to="/?dept=maintenance" />
          <MobileNavItem icon={House} to="/rooms" />
          <MobileNavItem icon={Settings} to="/settings" />
        </nav>
      </div>
    </div>
  );
}

function MobileNavItem({ icon: Icon, to }: { icon: any, to: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "p-3 rounded-2xl transition-all",
        isActive 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 -translate-y-2 scale-110" 
          : "text-slate-400 hover:text-blue-600"
      )}
    >
      <Icon className="w-6 h-6" />
    </NavLink>
  );
}
