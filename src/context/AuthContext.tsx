import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            let targetRole: UserRole = data.role;
            if (user.email === 'infra@bluetree.com.br') targetRole = 'maintenance';
            if (user.email === 'gov@bluetree.com.br') targetRole = 'governance';
            if (user.email === 'recep@bluetree.com.br') targetRole = 'reception';
            
            if (targetRole !== data.role) {
              await setDoc(docRef, { role: targetRole }, { merge: true });
              setProfile({ ...data, role: targetRole });
            } else {
              setProfile(data);
            }
          } else {
            let initialRole: UserRole = 'reception';
            if (user.email === 'infra@bluetree.com.br') initialRole = 'maintenance';
            if (user.email === 'gov@bluetree.com.br') initialRole = 'governance';
            if (user.email === 'recep@bluetree.com.br') initialRole = 'reception';

            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.email?.split('@')[0] || 'Usuário',
              email: user.email || '',
              role: initialRole,
              createdAt: new Date().toISOString(),
            };
            await setDoc(docRef, newProfile, { merge: true });
            setProfile(newProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth profile sync error:", err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => signOut(auth);

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { role }, { merge: true });
    setProfile(prev => prev ? { ...prev, role } : null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
