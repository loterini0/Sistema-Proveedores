import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { productoService } from "../../src/services/producto.service";
import { useAuthStore } from "../../src/store/auth.store";
import { colors } from "../../src/theme/colors";

interface ProductoDetalle {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: string;
  imagenUrl: string;
  empresa: {
    id: string;
    razonSocial: string;
    ciudad?: string;
    verificada: boolean;
  };
}

export default function ProductoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [producto, setProducto] = useState<ProductoDetalle>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productoService.get(id).then(setProducto).finally(() => setLoading(false));
  }, [id]);

  const cotizar = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    // Precarga el formulario de RFQ con esta empresa como destinataria
    router.push({
      pathname: "/rfq/nueva",
      params: { empresaId: producto?.empresa.id, productoNombre: producto?.nombre },
    });
  };

  if (loading) {
    return <Screen><Text>Cargando...</Text></Screen>;
  }

  if (!producto) {
    return <Screen><Text>Producto no encontrado</Text></Screen>;
  }

  return (
    <Screen scroll>
      <View style={styles.container}>
        <Image source={{ uri: producto.imagenUrl }} style={styles.image} />

        <Text style={styles.nombre}>{producto.nombre}</Text>
        {!!producto.precio && (
          <Text style={styles.precio}>
            ${Number(producto.precio).toLocaleString('es-CO')}
          </Text>
        )}

        {!!producto.descripcion && (
          <Text style={styles.descripcion}>{producto.descripcion}</Text>
        )}

        <TouchableOpacity
          style={styles.empresaRow}
          onPress={() => router.push(`/empresas/${producto.empresa.id}`)}
        >
          <View style={styles.empresaAvatar}>
            <Text style={styles.empresaAvatarText}>{producto.empresa.razonSocial.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.empresaNombreRow}>
              <Text style={styles.empresaNombre}>{producto.empresa.razonSocial}</Text>
              {producto.empresa.verificada && (
                <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
              )}
            </View>
            {!!producto.empresa.ciudad && (
              <Text style={styles.empresaCiudad}>{producto.empresa.ciudad}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cotizarBtn} onPress={cotizar}>
          <Text style={styles.cotizarBtnText}>
            {isAuthenticated ? "Solicitar cotización" : "Inicia sesión para cotizar"}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  image: { width: "100%", height: 220, borderRadius: 12, backgroundColor: colors.border },
  nombre: { fontSize: 22, fontWeight: "800", color: colors.text, marginTop: 4 },
  precio: { fontSize: 20, fontWeight: "700", color: colors.primary },
  descripcion: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  empresaRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginTop: 8, gap: 12 },
  empresaAvatar: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  empresaAvatarText: { color: colors.white, fontWeight: "700" },
  empresaNombreRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  empresaNombre: { fontSize: 15, fontWeight: "600", color: colors.text },
  empresaCiudad: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  cotizarBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  cotizarBtnText: { color: colors.white, fontWeight: "700", fontSize: 15 },
});