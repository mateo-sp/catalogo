import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

export type AdminAuthState = 'idle' | 'loading' | 'authorized' | 'unauthorized' | 'error';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

const FALLBACK_ADMINS = ['djgamer802@gmail.com', 'supposimon@gmail.com'];

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>('idle');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Escuchar cambios de auth al montar (si ya había sesión activa)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setState('loading');
        const authorized = await checkAdminAccess(user.email);
        if (authorized) {
          setAdminUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          setState('authorized');
        } else {
          await signOut(auth);
          setAdminUser(null);
          setState('idle');
        }
      } else {
        setAdminUser(null);
        setState((currentState) =>
          currentState === 'authorized' ? 'idle' : currentState
        );
      }
    });
    return () => unsub();
  }, []);

  /**
   * Verifica si el email está en la lista de admins almacenada en Firestore.
   * El documento admin_config/emails contiene: { list: string[] }
   */
  async function checkAdminAccess(email: string): Promise<boolean> {
    try {
      const configDoc = await getDoc(doc(db, 'admin_config', 'emails'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        const list: string[] = Array.isArray(data.list) ? data.list : [];
        return (
          list.some((e) => e.toLowerCase() === email.toLowerCase()) ||
          FALLBACK_ADMINS.some((e) => e.toLowerCase() === email.toLowerCase())
        );
      }
      return FALLBACK_ADMINS.some((e) => e.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.warn('No se pudo leer la lista de administradores:', error);
      return FALLBACK_ADMINS.some((e) => e.toLowerCase() === email.toLowerCase());
    }
  }

  /** Inicia el flujo de login con Google */
  async function login() {
    setErrorMessage(null);
    setState('loading');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.email) {
        setState('error');
        setErrorMessage('No se pudo obtener el email de la cuenta Google.');
        await signOut(auth);
        return;
      }

      const authorized = await checkAdminAccess(user.email);
      if (!authorized) {
        setState('unauthorized');
        setErrorMessage(
          `La cuenta "${user.email}" no tiene permisos de administrador.`
        );
        await signOut(auth);
        return;
      }

      setAdminUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      setState('authorized');
    } catch (error: unknown) {
      const errorCode =
        typeof error === 'object' && error !== null && 'code' in error
          ? error.code
          : null;
      if (errorCode === 'auth/popup-closed-by-user') {
        setState('idle');
      } else {
        setState('error');
        if (errorCode === 'auth/unauthorized-domain') {
          const hostname = window.location.hostname;
          setErrorMessage(
            `Firebase no permite iniciar sesión desde "${hostname}". Agregá ese dominio en Firebase Console > Authentication > Settings > Authorized domains.`
          );
        } else {
          setErrorMessage(
            error instanceof Error ? error.message : 'Error al iniciar sesión.'
          );
        }
      }
    }
  }

  /** Cierra la sesión de admin */
  async function logout() {
    await signOut(auth);
    setAdminUser(null);
    setState('idle');
    setErrorMessage(null);
  }

  return { state, adminUser, errorMessage, login, logout };
}
