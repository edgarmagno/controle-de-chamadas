import React, { useState } from 'react';
import { Hotel, Key, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError('Credenciais inválidas ou usuário não encontrado.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[40vh] bg-[#0f172a] clip-path-slant"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-[32px] p-10 flex flex-col gap-8 shadow-2xl shadow-blue-900/10 relative z-10"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-[#2563eb] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">HotelLink</h1>
            <p className="text-[#64748b] font-medium text-sm">Controle sua operação com precisão</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b] ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nome@hotel.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b] ml-1">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full h-14 bg-[#0f172a] hover:bg-[#1e293b] text-white flex items-center justify-center gap-4 rounded-xl font-bold transition-all active:scale-95 group shadow-lg shadow-slate-900/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <Key className="w-4 h-4 text-blue-400" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-[#e2e8f0] w-full text-center">
          <div className="inline-flex items-center gap-2 text-[10px] text-[#64748b] bg-slate-100 px-4 py-2 rounded-full uppercase tracking-[0.1em] font-black">
            Terminal de Operações v2.0
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center relative z-10">
        <p className="text-[#64748b] text-xs font-bold uppercase tracking-widest">© 2026 HotelLink Systems</p>
      </div>
    </div>
  );
}
