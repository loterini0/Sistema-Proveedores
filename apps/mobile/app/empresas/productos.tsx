import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/colors";
import { empresaService } from "../../src/services/empresa.service";
import { Producto } from "../../src/services/mock.data";
import { useAuthStore } from "../../src/store/auth.store";

export default function ProductosScreen() {
  const empresaId = useAuthStore((state) => state.user?.empresaId);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    if (!empresaId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    empresaService
      .getProductos(empresaId)
      .then(setProductos)
      .finally(() => setLoading(false));
  }, [empresaId]);

  useFocusEffect(cargar);

  const handleEliminar = (producto: Producto) => {
    Alert.alert("Eliminar producto", `¿Eliminar "${producto.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          if (!empresaId) return;
          try {
            await empresaService.deleteProducto(empresaId, producto.id);
            setProductos((current) => current.filter((p) => p.id !== producto.id));
          } catch {
            Alert.alert("Error", "No se pudo eliminar el producto.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Productos</Text>
            <Button
              label="Agregar producto"
              onPress={() => router.push("/empresas/producto-form")}
            />
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.emptyState}>
            <Text style={styles.emptyText}>Todavía no has agregado productos.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.nombre}</Text>
              {!!item.precio && <Text style={styles.precio}>${item.precio}</Text>}
            </View>
            {!!item.descripcion && (
              <Text style={styles.description} numberOfLines={2}>
                {item.descripcion}
              </Text>
            )}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/empresas/producto-form",
                    params: { productoId: item.id },
                  })
                }
              >
                <Text style={styles.editLink}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEliminar(item)}>
                <Text style={styles.deleteLink}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, padding: 16 },
  header: { gap: 12, marginBottom: 8 },
  title: { color: colors.text, fontSize: 28, fontWeight: "800" },
  card: { gap: 8 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: colors.text, fontSize: 17, fontWeight: "800", flexShrink: 1 },
  precio: { color: colors.primary, fontWeight: "700" },
  description: { color: colors.textSecondary, lineHeight: 20 },
  actions: { flexDirection: "row", gap: 20, marginTop: 4 },
  editLink: { color: colors.primary, fontWeight: "700" },
  deleteLink: { color: colors.error, fontWeight: "700" },
  emptyState: { alignItems: "center", padding: 24 },
  emptyText: { color: colors.textSecondary },
});
