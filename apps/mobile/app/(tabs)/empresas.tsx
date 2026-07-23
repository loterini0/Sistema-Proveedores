import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { Empresa } from "../../src/services/mock.data";
import { empresaService } from "../../src/services/empresa.service";
import { colors } from "../../src/theme/colors";

export default function EmpresasScreen(){
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        empresaService
            .search()
            .then(setEmpresas)
            .finally(() => setLoading(false));
    }, []);

    if(loading){
        return(
            <Screen>
                <FlatList
                    data={empresas}
                    keyExtractor={(empresa) => empresa.id}
                    contentContainerStyle={styles.content}
                    ListHeaderConponent={
                        <View style={styles.header}>
                            <Text style={styles.title}>Empresas</Text>
                            <Text style={styles.subtitle}>
                                Explora proveedores registrados en la plataforma
                            </Text>
                        </View>
                    }
                    renderItem={({item}) => (
                        <Pressable
                            onPress={() =>
                                router.push({pathname: "/empresas/[id]", params: {id: item.id}})
                            }
                        >
                            <Card style={styles.card}>
                                <Text style={styles.name}>{item.razonSocial}</Text>
                                <Text style={styles.location}>
                                    {item.ciudad}, {item.departamento}
                                </Text>
                                {!!item.descripcion && (
                                    <Text style={styles.description} numberOfLines={2}>
                                        {item.descripcion}
                                    </Text>
                                )}
                            </Card>
                        </Pressable>
                    )}
                />
            </Screen>
        )
    }
}


const styles = StyleSheet.create({
  content: { gap: 12, padding: 16 },
  header: { gap: 6, marginBottom: 8 },
  title: { color: colors.text, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15 },
  card: { gap: 6 },
  name: { color: colors.text, fontSize: 18, fontWeight: "800" },
  location: { color: colors.primary, fontSize: 14, fontWeight: "600" },
  description: { color: colors.textSecondary, lineHeight: 20 },
});