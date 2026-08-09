import { createWithEqualityFn as create } from "zustand/traditional";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { authService } from "../services/api";
import { router } from "expo-router";

export interface User {
  id: string;
  email: string;
  nombre: string;
  empresaId: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  restoreSession: () => Promise<void>;
  setUser: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  esProveedor: () => boolean;
}

const isWeb = Platform.OS === "web";

const getItem = async (key: string) => {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

const setItem = async (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const deleteItem = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  restoreSession: async () => {
    try {
      const accessToken = await getItem("accessToken");

      if (!accessToken) {
        return;
      }

      const { data } = await authService.me();
      const user = data.user;

      set({
        user: {
          id: user.id ?? user.userId,
          nombre: user.nombre,
          email: user.email,
          empresaId: user.empresaId ?? null,
        },
        isAuthenticated: true,
      });
    } catch {
      await deleteItem("accessToken");
      await deleteItem("refreshToken");

      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({
        isHydrated: true,
      });
    }
  },

  setUser: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    set({
      user,
      isAuthenticated: true,
      isHydrated: true,
    });
  },

  logout: async () => {

    try{
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } finally{
      set({
        user: null,
        isAuthenticated: false,
      });
    }
    
    router.replace("/auth/login")
  },

  esProveedor: () => !!get().user?.empresaId,
}));