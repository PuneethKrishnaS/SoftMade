import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  student_profile?: any;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setTokens: (access, refresh) => 
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      fetchProfile: async () => {
        try {
          const res = await api.get('auth/me/');
          set({ user: res.data });
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      }
    }),
    {
      name: 'softmade-auth',
    }
  )
);
