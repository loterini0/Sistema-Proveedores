import { Tabs } from "expo-router";
import {Building2, ClipboardList, House, User } from "lucide-react-native"
import { colors } from "../../src/theme/colors";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textSecondary }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <House color = {color} size = {size}/>
        }}
      />

      <Tabs.Screen
        name="empresas"
        options={{
          title: "Empresas",
          tabBarIcon: ({ color, size }) => (
            <Building2 color={color} size={size}/>
          )
        }}
      />
      
      <Tabs.Screen
        name="rfqs"
        options={{
          title: "RFQs",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size}/>
          )
        }}
      />
      
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size = {size}/>
        }}
      />
    </Tabs>
  );
}