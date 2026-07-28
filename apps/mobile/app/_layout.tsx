import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/auth.store';
import { colors } from '../src/theme/colors';
import { View } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if(!isHydrated){
    return(
      <View 
        style={{
          flex:1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size = "large" color = {colors.primary}/>
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerBackTitle: "Atras"}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack.Protected>


        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
          <Stack.Screen name="empresas" options={{ headerShown: false }} />
          <Stack.Screen name="rfq" options={{ headerShown: false}} />

        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
