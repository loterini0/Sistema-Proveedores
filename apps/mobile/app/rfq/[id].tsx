import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { Rfq } from "../../src/services/mock.data";
import { rfqService } from "../../src/services/rfq.service";
import { useAuthStore } from "../../src/store/auth.store";
import { colors } from "../../src/theme/colors";

export default function RfqDetailScreen(){
    const {id} = useLocalSearchParams<{id: string}>()
    const [rfq, setRfq] = useState<Rfq>()
    const [loading, setLoading] = useState(true)
    const userId = useAuthStore((state) => state.user?.id)

    useEffect(() => {
        rfqService.get(id).then(setRfq).finally(() => setLoading(false))
    }, [id])

    if(loading){
        return <Screen><ActivityIndicator color={colors.primary}/></Screen>
    }

    if(!rfq){
        return <Screen><Text>RFQ no encontrada</Text></Screen>
    }

    const esElDueño = rfq.compradorId === userId;

    return(
        <Screen scroll>
            <View style={styles.container}>
                <Text style={styles.title}>{rfq.titulo}</Text>

                <Card style={styles.card}>
                    <Text style={styles.label}>Estado</Text>
                    <Text>{rfq.status}</Text>

                    <Text style={styles.label}>Fecha limite</Text>
                    <Text>
                        {rfq.fechaLimite
                            ? new Date(rfq.fechaLimite).toLocaleDateString("es-co")
                            : "Sin fecha límite"}
                    </Text>

                    <Text style={styles.label}>Descripcion</Text>
                    <Text style={styles.description}>{rfq.descripcion}</Text>
                </Card>

                {!esElDueño && rfq.status === "active" && (
                    <Button
                        label="Enviar cotización"
                        onPress={() =>
                            router.push({ pathname: "/rfq/cotizar", params: { rfqId: rfq.id } })
                        }
                    />
                )}
            </View>
        </Screen>
    )

}


const styles = StyleSheet.create({
    container: {gap: 16, padding: 16},
    title: {color: colors.text, fontSize: 28, fontWeight: "800"},
    card: {gap: 6},
    label: {color: colors.primary, fontWeight: "800", marginTop: 8},
    description: {color: colors.textSecondary, lineHeight: 22},
})
