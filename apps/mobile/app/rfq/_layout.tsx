import { Stack } from 'expo-router';

export default function RfqLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Detalle RFQ' }} />
      <Stack.Screen name="nueva" options={{ title: "Nueva RFQ" }}/>
      <Stack.Screen name="cotizar" options={{ title: "Enviar cotización" }}/>
    </Stack>
  );
}
