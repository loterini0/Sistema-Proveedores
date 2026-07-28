import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useAuthStore } from "../../src/store/auth.store";
import { colors } from "../../src/theme/colors";

export default function HomeScreen(){
    const user = useAuthStore((state) => state.user)

    return(
        <Screen>
            <View style={styles.container}>
                <Text style={styles.eyebrow}>Sistema Proveedores</Text>
                <Text style={styles.title}>Hola, {user?.nombre ?? "usuario"}</Text>
                <Text style={styles.subtitle}>
                    Encuentra empresas, consulta RFQs o crea un nueva solicitud
                </Text>

                <View style={styles.actions}>
                    <Button label="Explorar empresas" onPress={() => router.push("/empresas")}/>
                    <Button
                        label="Ver mis RFQs"
                        variant="outline"
                        onPress={() => router.push("/rfqs")}
                    />
                </View>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "center", gap: 16, padding: 24},
    eyebrow: {color: colors.primary, fontWeight: "700"},
    title: {color: colors.text, fontSize: 30, fontWeight: "800"},
    subtitle: {color: colors.textSecondary, fontSize: 16, lineHeight: 24},
    actions: {gap: 12, marginTop: 16}
})