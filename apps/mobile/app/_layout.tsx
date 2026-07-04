import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="empresas" options={{ title: 'Empresas' }} />
        <Stack.Screen name="rfq" options={{ title: 'RFQ' }} />
      </Stack>
    </QueryClientProvider>
  );
}
