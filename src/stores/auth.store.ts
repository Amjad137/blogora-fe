import { environment } from '@/config/env.config';
import { USER_ROLE } from '@/constants/user.constants';
import { signOut } from '@/services/auth.service';
import { IUser } from '@/types/user.type';
import localforage from 'localforage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type AuthStore = {
  isInitialized: boolean;
  setIsInitialized: (value: boolean) => void;

  user: IUser | null;
  setUser: (user: IUser | null) => void;
  updateUser: (updates: Partial<IUser>) => void;

  userRole: USER_ROLE | null;
  setUserRole: (userRole: USER_ROLE | null) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  token: string | null;
  setToken: (token: string | null) => void;

  signOutApp: () => Promise<void>;

  // Security: Clear sensitive data (for password reset scenarios)
  clearSensitiveData: () => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        isInitialized: false,
        setIsInitialized: (value) => set({ isInitialized: value }),

        user: null,
        setUser: (user) => set({ user }),
        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        userRole: null,
        setUserRole: (userRole) => set({ userRole }),

        isAuthenticated: false,
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

        loading: false,
        setLoading: (loading) => set({ loading }),

        token: null,
        setToken: (token) => set({ token }),

        signOutApp: async () => {
          signOut();

          set({
            user: null,
            userRole: null,
            isAuthenticated: false,
            loading: false,
            token: null,
          });
        },

        clearSensitiveData: () => {
          set({
            user: null,
            userRole: null,
            isAuthenticated: false,
            loading: false,
            token: null,
          });
        },
      }),
      {
        name: environment.authStoreKey,
        storage: createJSONStorage(() => localforage),
        partialize: (state) => ({
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          userRole: state.userRole,
          user: state.user,
        }),
      },
    ),
  ),
);
