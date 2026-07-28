import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { authService } from "../services/api";

export interface User {
  id: string;
  email: string;
  nombre: string;
  empresaId: string | null; // NUEVO
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  restoreSession: () => Promise<void>
  setUser: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  esProveedor: () => boolean; // NUEVO
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  restoreSession: async() => {
    try{
      const accessToken = await SecureStore.getItemAsync("accessToken")

      if(!accessToken){
        return;
      }

      const {data} = await authService.me();
      const user = data.user;

      set ({
        user:{
          id: user.id ?? user.userId,
          nombre: user.nombre,
          email: user.email,
          empresaId: user.empresaId ?? null,
        },
        isAuthenticated: true,
      });
    } catch{
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      set({user:null, isAuthenticated: false});
    } finally{
      set({isHydrated: true});
    }
  },
  
  setUser: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    set({ user, isAuthenticated: true });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    set({ user: null, isAuthenticated: false });
  },
  esProveedor: () => !!get().user?.empresaId, // NUEVO
}));