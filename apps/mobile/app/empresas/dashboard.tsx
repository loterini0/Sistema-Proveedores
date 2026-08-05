import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/colors";
import { empresaService } from "../../src/services/empresa.service";
import { Empresa, Producto } from "../../src/services/mock.data";
import { useAuthStore } from "../../src/store/auth.store";

export default function EmpresaDashboardScreen() {
  const empresaId = useAuthStore((state) => state.user?.empresaId);
  const [empresa, setEmpresa] = useState<Empresa>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    if (!empresaId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([empresaService.get(empresaId), empresaService.getProductos(empresaId)])
      .then(([emp, prods]) => {
        setEmpresa(emp);
        setProductos(prods);
      })
      .finally(() => setLoading(false));
  }, [empresaId]);

  // useFocusEffect ya se dispara en el montaje inicial y cada vez que
  // volvemos a esta pantalla (p.ej. después de editar un producto).
  useFocusEffect(cargar);

  if (!empresaId) {
    return (
      <Screen>
        <View style={styles.container}>
          <Text style={styles.title}>Aún no tienes empresa</Text>
          <Button label="Registrar mi empresa" onPress={() => router.push("/empresas/nueva")} />
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.container}>
        <Text style={styles.title}>{empresa?.razonSocial ?? "Mi empresa"}</Text>
        <Text style={styles.subtitle}>
          {empresa?.ciudad ? `${empresa.ciudad}, ${empresa.departamento}` : "Sin ubicación registrada"}
        </Text>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{productos.length}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </Card>
        </View>

        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Gestionar</Text>

          <Button
            label="Editar perfil de empresa"
            variant="outline"
            onPress={() => router.push("/empresas/editar")}
            style={styles.actionButton}
          />
          <Button
            label={`Productos (${productos.length})`}
            variant="outline"
            onPress={() => router.push("/empresas/productos")}
            style={styles.actionButton}
          />
          <Button
            label="RFQs y cotizaciones"
            variant="outline"
            onPress={() => router.push("/rfqs")}
            style={styles.actionButton}
          />
        </Card>

        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Vista pública</Text>
          <Text style={styles.helperText}>
            Así es como te ven los compradores.
          </Text>
          <Button
            label="Ver mi perfil público"
            variant="outline"
            onPress={() =>
              router.push({ pathname: "/empresas/[id]", params: { id: empresaId } })
            }
            style={styles.actionButton}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 16, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15 },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 18 },
  statNumber: { color: colors.primary, fontSize: 26, fontWeight: "800" },
  statLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  actionsCard: { gap: 10 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  helperText: { color: colors.textSecondary, fontSize: 13, marginTop: -4 },
  actionButton: { alignSelf: "stretch" },
});
