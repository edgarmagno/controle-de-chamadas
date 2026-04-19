import React, { useEffect, useRef, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Ticket, Department } from '../types';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

// Notification Sound URL
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export function NotificationManager() {
  const { profile } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Basic Notification Permission check
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setEnabled(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setEnabled(true);
      playTestSound();
    }
  };

  const playTestSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setAudioAllowed(true);
    }
  };

  useEffect(() => {
    if (!profile || !enabled) return;

    // Listen only for relevant department or all if reception
    const department = profile.role === 'reception' ? undefined : profile.role as Department;
    
    let q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'), limit(10));
    if (department) {
      q = query(q, where('department', '==', department));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const ticket = change.doc.data() as Ticket;
          
          // Trigger notification
          const title = `Novo Chamado: Quarto #${ticket.roomNumber}`;
          const options = {
            body: ticket.description,
            icon: '/favicon.ico', // Fallback, could be a specific icon
            tag: 'new-ticket'
          };

          if (Notification.permission === 'granted') {
            new Notification(title, options);
          }

          // Trigger Sound
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
               console.warn("Audio blocked by browser. Interaction required.");
               setAudioAllowed(false);
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [profile, enabled]);

  return (
    <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
      <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" />
      
      {!enabled || !audioAllowed ? (
        <button 
          onClick={requestPermission}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce text-xs lg:text-sm"
        >
          {!enabled ? <BellOff className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>Ativar Alertas Sonoros</span>
        </button>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm shadow-sm">
           <Volume2 className="w-3 h-3" />
           <span>Alertas Ativos</span>
        </div>
      )}
    </div>
  );
}
