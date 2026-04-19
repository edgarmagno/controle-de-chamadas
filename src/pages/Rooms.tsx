import React, { useState, useEffect } from 'react';
import { Plus, Hotel, Search, Filter, Trash2, MapPin } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Room {
  id: string;
  number: string;
  type: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
}

export function Rooms() {
  const { profile } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const isReception = profile?.role === 'reception';

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('number', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Room[];
      setRooms(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAddRoom = async (data: any) => {
    await addDoc(collection(db, 'rooms'), {
      ...data,
      status: 'available'
    });
    setShowModal(false);
  };

  const handleDeleteRoom = async (id: string) => {
    if (confirm('Deseja excluir este quarto?')) {
      await deleteDoc(doc(db, 'rooms', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Cadastro de Apartamentos</h1>
          <p className="text-[#64748b] font-medium text-sm">Gerencie a estrutura física do hotel</p>
        </div>
        
        {isReception && (
          <button 
            onClick={() => setShowModal(true)}
            className="h-14 bg-[#2563eb] hover:bg-[#1e40af] text-white px-8 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Apartamento</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-[#64748b]">Nº Quarto</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-[#64748b]">Tipo / Categoria</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-[#64748b]">Andar</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-[#64748b]">Status Atual</th>
                {isReception && <th className="px-6 py-4 text-right"></th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">Carregando...</td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Hotel className="w-10 h-10" />
                      <p className="font-bold">Nenhum quarto cadastrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rooms.map(room => (
                  <tr key={room.id} className="border-b border-[#e2e8f0] hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 font-black text-slate-900">#{room.number}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{room.type}</td>
                    <td className="px-6 py-4 text-slate-500">{room.floor}º andar</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "badge",
                        room.status === 'available' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        room.status === 'occupied' ? "bg-sky-50 text-sky-600 border border-sky-100" :
                        "bg-slate-100 text-slate-500 border border-slate-200"
                      )}>
                        {room.status === 'available' ? 'Disponível' : 
                         room.status === 'occupied' ? 'Ocupado' : 
                         room.status === 'maintenance' ? 'Manutenção' : 'Limpeza'}
                      </span>
                    </td>
                    {isReception && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-[#e2e8f0]">
          {loading ? (
            <div className="p-10 text-center text-slate-400">Carregando...</div>
          ) : rooms.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center gap-2 opacity-30">
              <Hotel className="w-10 h-10" />
              <p className="font-bold">Nenhum quarto cadastrado</p>
            </div>
          ) : (
            rooms.map(room => (
              <div key={room.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100">
                    <span className="text-xs font-black text-slate-900 leading-none">#{room.number}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase">{room.floor}º</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{room.type}</p>
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        room.status === 'available' ? "text-emerald-500" :
                        room.status === 'occupied' ? "text-sky-500" : "text-slate-400"
                    )}>
                      {room.status === 'available' ? 'Disponível' : 
                       room.status === 'occupied' ? 'Ocupado' : 'Outro'}
                    </span>
                  </div>
                </div>
                {isReception && (
                  <button 
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-3 text-red-300 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <RoomModal 
            onClose={() => setShowModal(false)} 
            onSubmit={handleAddRoom} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RoomModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    number: '',
    type: 'Standard',
    floor: ''
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
        className="bg-white w-full max-w-md p-6 lg:p-10 rounded-[32px] border border-[#e2e8f0] relative z-10 shadow-2xl space-y-6 lg:space-y-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Novo Apartamento</h2>
            <p className="text-xs text-[#64748b] font-bold uppercase tracking-widest text-center">Configuração de Unidade</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Nº Apartamento</label>
            <input 
              required
              type="text" 
              value={formData.number}
              onChange={e => setFormData({...formData, number: e.target.value})}
              placeholder="Ex: 302"
              className="w-full px-5 py-4 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Categoria</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900 appearance-none"
            >
              <option value="Standard">Standard</option>
              <option value="Luxo">Luxo</option>
              <option value="Suíte Master">Suíte Master</option>
              <option value="Presidencial">Presidencial</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">Andar</label>
            <input 
              required
              type="number" 
              value={formData.floor}
              onChange={e => setFormData({...formData, floor: e.target.value})}
              placeholder="Ex: 3"
              className="w-full px-5 py-4 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full h-16 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
              Salvar Cadastro
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
