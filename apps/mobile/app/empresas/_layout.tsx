import { Stack } from 'expo-router';

export default function EmpresasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Empresas' }} />
    </Stack>
  );
}
