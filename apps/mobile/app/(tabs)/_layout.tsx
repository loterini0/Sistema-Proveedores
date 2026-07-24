import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="rfqs"
        options={{
          title: "RFQs",
        }}
      />

      {/* En el futuro puedes agregar más pestañas */}
      {/* <Tabs.Screen name="empresas" options={{ title: "Empresas" }} /> */}
      {/* <Tabs.Screen name="perfil" options={{ title: "Perfil" }} /> */}
    </Tabs>
  );
}