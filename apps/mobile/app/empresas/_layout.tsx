import { Stack } from 'expo-router';

export default function EmpresasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Empresas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Perfil de empresas' }} />
      <Stack.Screen name="nueva" options={{ title: 'Registrar empresa' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Mi empresa' }} />
      <Stack.Screen name="editar" options={{ title: 'Editar empresa' }} />
      <Stack.Screen name="productos" options={{ title: 'Productos' }} />
      <Stack.Screen name="producto-form" options={{ title: 'Producto' }} />
    </Stack>
  );
}
