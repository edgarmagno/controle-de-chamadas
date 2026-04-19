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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialLoad = useRef(true);

  // Silent Audio & Notification Unlocker
  useEffect(() => {
    const unlock = async () => {
      // 1. Try to unlock Audio
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
            // Successfully unlocked audio
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
          })
          .catch(() => {
            // Still waiting for valid interaction
          });
      }

      // 2. Try to request Notification permission silently on click
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      }
    };

    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  useEffect(() => {
    if (!profile) return;

    const department = profile.role === 'reception' ? undefined : profile.role as Department;
    
    let q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'), limit(1));
    if (department) {
      q = query(q, where('department', '==', department));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Safety: Don't notify on the very first data load of existing tickets
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        // Only notify for NEW tickets (added)
        if (change.type === 'added') {
          const ticket = change.doc.data() as Ticket;
          
          // Browser Notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`HotelLink: Novo Chamado #${ticket.roomNumber}`, {
              body: ticket.description,
              tag: 'new-ticket',
              requireInteraction: true // Keep it visible until user acts
            });
          }

          // Play Sound
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.warn("Audio blocked:", e));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [profile]);

  return <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" className="hidden" aria-hidden="true" />;
}
