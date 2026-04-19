import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Ticket, Department, TicketStatus, TicketPriority } from '../types';

export function useTickets(department?: Department) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    
    if (department) {
      q = query(q, where('department', '==', department));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(docs);
      setLoading(false);
    });

    return unsubscribe;
  }, [department]);

  return { tickets, loading };
}

export async function createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) {
  return addDoc(collection(db, 'tickets'), {
    ...ticket,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus, assignedTo?: string) {
  const docRef = doc(db, 'tickets', ticketId);
  return updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
    ...(assignedTo ? { assignedTo } : {})
  });
}
