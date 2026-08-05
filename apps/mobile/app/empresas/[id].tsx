import { useLocalSearchParams, router } from "expo-router"; // agregar router
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { empresaService } from "../../src/services/empresa.service";
import { Empresa, Producto } from "../../src/services/mock.data";
import { colors } from "../../src/theme/colors";

interface EmpresaConProductos extends Empresa {
  productos?: Producto[];
}

export default function EmpresaDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [empresa, setEmpresa] = useState<EmpresaConProductos>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        empresaService.get(id).then(setEmpresa).finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <Screen><Text>Cargando...</Text></Screen>;
    }

    if (!empresa) {
        return <Screen><Text>Empresa no encontrada</Text></Screen>;
    }

    return (
        <Screen scroll>
            <View style={styles.container}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{empresa.razonSocial.charAt(0)}</Text>
                </View>
                <Text style={styles.title}>{empresa.razonSocial}</Text>

                <Card style={styles.card}>
                    {!!empresa.nit && (
                        <>
                            <Text style={styles.label}>NIT</Text>
                            <Text style={styles.value}>{empresa.nit}</Text>
                        </>
                    )}

                    <Text style={styles.label}>Ubicación</Text>
                    <Text style={styles.value}>{empresa.ciudad}, {empresa.departamento}</Text>

                    {!!empresa.descripcion && (
                        <>
                            <Text style={styles.label}>Descripción</Text>
                            <Text style={styles.value}>{empresa.descripcion}</Text>
                        </>
                    )}
                </Card>

                <Text style={styles.sectionTitle}>Productos</Text>
                {!empresa.productos || empresa.productos.length === 0 ? (
                    <Text style={styles.empty}>Esta empresa aún no tiene productos publicados.</Text>
                ) : (
                    <View style={styles.grid}>
                        {empresa.productos.map((p) => (
                        <Pressable key={p.id} onPress={() => router.push(`/productos/${p.id}`)}>
                            <Card style={styles.productoCard}>
                              <Image source={{ uri: p.imagenUrl }} style={styles.productoImg} />
                             <Text style={styles.productoNombre} numberOfLines={2}>{p.nombre}</Text>
                             {!!p.precio && (
                                <Text style={styles.productoPrecio}>
                                ${Number(p.precio).toLocaleString('es-CO')}
                                </Text>
                            )}
                            </Card>
                        </Pressable>
))}
                    </View>
                )}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, padding: 16 },
    avatar: { width: 56, height: 56, borderRadius: 14, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
    avatarText: { color: colors.white, fontSize: 24, fontWeight: "800" },
    title: { color: colors.text, fontSize: 26, fontWeight: "800", marginTop: -8 },
    card: { gap: 4 },
    label: { color: colors.textSecondary, fontWeight: "600", fontSize: 12, marginTop: 10, textTransform: "uppercase" },
    value: { color: colors.text, fontSize: 15 },
    sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 8 },
    empty: { color: colors.textSecondary, fontStyle: "italic" },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    productoCard: { width: "47%", padding: 0, overflow: "hidden" },
    productoImg: { width: "100%", height: 100 },
    productoNombre: { fontSize: 13, fontWeight: "600", color: colors.text, padding: 10, paddingBottom: 4 },
    productoPrecio: { fontSize: 13, fontWeight: "700", color: colors.primary, paddingHorizontal: 10, paddingBottom: 10 },
});