import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../api/firebase';

interface AuthState {
  isAdmin: boolean;
  adminUser: User | null;
  hasPasscode: boolean;
  loading: boolean;
  
  setAdminUser: (user: User | null) => void;
  unlockPasscode: () => void;
  lockPasscode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      adminUser: null,
      hasPasscode: false,
      loading: true,

      setAdminUser: (user) => set({ adminUser: user, isAdmin: !!user, loading: false }),
      unlockPasscode: () => set({ hasPasscode: true }),
      lockPasscode: () => set({ hasPasscode: false })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ hasPasscode: state.hasPasscode }) // persist only passcode memory
    }
  )
);

// Subscribe to Firebase Auth state globally
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setAdminUser(user);
});
