import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { Rfq } from "../../src/services/mock.data";
import { rfqService } from "../../src/services/rfq.service";
import { colors } from "../../src/theme/colors";

export default function RfqDetailScreen(){
    const {id} = useLocalSearchParams<{id: string}>()
    const [rfq, setRfq] = useState<Rfq>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        rfqService.get(id).then(setRfq).finally(() => setLoading(false))
    }, [id])

    if(loading){
        return <Screen><ActivityIndicator color={colors.primary}/></Screen>
    }

    if(!rfq){
        return <Screen><Text>RFQ no encontrada</Text></Screen>
    }

    return(
        <Screen scroll>
            <View style={styles.container}>
                <Text style={styles.title}>{rfq.titulo}</Text>

                <Card style={styles.card}>
                    <Text style={styles.label}>Estado</Text>
                    <Text>{rfq.status}</Text>

                    <Text style={styles.label}>Fecha limite</Text>
                    <Text>{new Date(rfq.fechaLimite).toLocaleDateString("es-co")}</Text>

                    <Text style={styles.label}>Descripcion</Text>
                    <Text style={styles.description}>{rfq.descripcion}</Text>
                </Card>
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
