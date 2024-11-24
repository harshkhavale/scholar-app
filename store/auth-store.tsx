// store/authStore.ts
import { Educator, User } from "@/types/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  educator: Educator | null;
  token: string | null;

  setUser: (user: User) => void;
  setEducator: (educator: Educator| undefined) => void;
  setToken: (token: string) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  educator: null,
  setUser: (user) => set({ user }),
  setEducator: (educator) => set({ educator }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
}));
