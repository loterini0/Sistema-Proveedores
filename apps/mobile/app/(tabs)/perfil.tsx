import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { useAuthStore } from "../../src/store/auth.store";
import { colors } from "../../src/theme/colors";

export default function PerfilScreen() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        Alert.alert("Cerrar sesión", "¿Deseas cerrar tu sesión?", [
            {text: "Cancelar", style: "cancel"},
            {
                text: "Cerrar sesion",
                style: "destructive",
                onPress: async() => {
                    await logout();
                    router.replace("/auth/login");
                },
            },
        ]);
    };

    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.title}>Mi cuenta</Text>

                <Card style={styles.card}>
                    <Text style={styles.name}>{user?.nombre}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <Text style={styles.role}>
                        {user?.empresaId ? "Cuenta con empresa registrada" : "Cuenta de comprador"}
                    </Text>
                </Card>

                {user?.empresaId ? (
                    <Button
                        label="Ir a mi empresa"
                        onPress={() => router.push("/empresas/dashboard")}
                    />
                ) : (
                    <Button
                        label="Registrar mi empresa"
                        variant="outline"
                        onPress={() => router.push("/empresas/nueva")}
                    />
                )}

                <Button label = "Cerrar sesion" variant="danger" onPress={handleLogout}/>
            </View>
        </Screen>
    )
}


const styles = StyleSheet.create({
    container: {flex: 1, gap: 16, padding: 16},
    title: {color: colors.text, fontSize: 30, fontWeight: "800"},
    card: {gap: 8},
    name: {color: colors.text, fontSize: 20, fontWeight: "800"},
    email: {color: colors.textSecondary, fontSize: 15},
    role: {color: colors.primary, fontWeight: "700", marginTop: 6}
})