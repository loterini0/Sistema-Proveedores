import { Stack } from 'expo-router';

export default function EmpresasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Empresas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Perfil de empresas' }} />
      <Stack.Screen name="nueva" options={{ title: 'Registrar empresa' }} />
    </Stack>
  );
}
