import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// expo-secure-store no tiene soporte completo en web (algunos métodos
// nativos como deleteValueWithKeyAsync no existen ahí y truenan la app
// al arrancar). Este wrapper usa SecureStore en iOS/Android y localStorage
// en web, con la misma interfaz async en ambos casos.
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
