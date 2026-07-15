import { Stack } from 'expo-router';

export default function RfqLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'RFQ' }} />
      <Stack.Screen name="nueva" options={{ title: "Nueva RFQ" }}/>
    </Stack>
  );
}
