import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { empresaService } from "../../src/services/empresa.service";
import { Empresa } from "../../src/services/mock.data";
import { colors } from "../../src/theme/colors";

export default function EmpresaDetailScreen(){
    const {id} = useLocalSearchParams<{id: string}>()
    const [empresa, setEmpresa] = useState<Empresa>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        empresaService.get(id).then(setEmpresa).finally(() => setLoading(false));
    }, [id])

    if(loading){
        return <Screen><Text>Empresa no encontrada</Text></Screen>
    }

    if(!empresa){
        return <Screen><Text>Empresa no encontrada</Text></Screen>
    }

    return(
        <Screen scroll>
            <View style={styles.container}>
                <Text style={styles.title}>{empresa.razonSocial}</Text>

                <Card style={styles.card}>
                    <Text style={styles.label}>NIT</Text>
                    <Text>{empresa.nit}</Text>

                    <Text style={styles.label}>Ubicacion</Text>
                    <Text>{empresa.ciudad}, {empresa.departamento}</Text>

                    {!!empresa.descripcion && (
                        <>
                            <Text style={styles.label}>Descripcion</Text>
                            <Text>{empresa.descripcion}</Text>
                        </>
                    )}
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
})