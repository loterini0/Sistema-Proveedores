import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { Badge } from "../../src/components/Badge";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { mockCotizaciones, mockEmpresas, mockRfqs, mockUsuarios, Rfq, RfqStatus} from "../../src/services/mock.data";
import { useAuthStore } from "../../src/store/auth.store";
import { colors } from "../../src/theme/colors";

type StatusFilter = "all" | RfqStatus;

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Todas", value: "all" },
  { label: "Activas", value: "active" },
  { label: "Borrador", value: "draft" },
  { label: "Cerradas", value: "closed" },
  { label: "Adjudicadas", value: "awarded" },
];

const statusCopy: Record<
  RfqStatus,
  { label: string; badge: React.ComponentProps<typeof Badge>["status"] }
> = {
  active: { label: "Activa", badge: "success" },
  draft: { label: "Borrador", badge: "default" },
  closed: { label: "Cerrada", badge: "error" },
  awarded: { label: "Adjudicada", badge: "warning" },
  cacelled: { label: "Cancelada", badge: "error" },
};

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function RfqsScreen() {
  const authUser = useAuthStore((state) => state.user);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const currentUserId = authUser?.id ?? mockUsuarios[0]?.id;

  const buyerEmpresaIds = useMemo(
    () =>
      mockEmpresas
        .filter((empresa) => empresa.userId === currentUserId)
        .map((empresa) => empresa.id),
    [currentUserId],
  );

  const rfqs = useMemo(() => {
    const userRfqs = mockRfqs.filter((rfq) =>
      buyerEmpresaIds.includes(rfq.compradorId),
    );

    if (selectedStatus === "all") {
      return userRfqs;
    }

    return userRfqs.filter((rfq) => rfq.status === selectedStatus);
  }, [buyerEmpresaIds, selectedStatus]);

  const handleCreateRfq = () => {
    router.push("/rfq");
  };

  const handleOpenRfq = (id: string) => {
    router.push({
      pathname: "/rfq/[id]",
      params: { id },
    });
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Dashboard comprador</Text>
          <Text style={styles.title}>RFQs</Text>
          <Text style={styles.subtitle}>
            Gestiona tus solicitudes y revisa las cotizaciones recibidas.
          </Text>
        </View>

        <Button
          label="Nueva RFQ"
          onPress={handleCreateRfq}
          style={styles.createButton}
        />
      </View>

      <View style={styles.filters}>
        {statusFilters.map((filter) => {
          const isSelected = selectedStatus === filter.value;

          return (
            <TouchableOpacity
              key={filter.value}
              activeOpacity={0.75}
              onPress={() => setSelectedStatus(filter.value)}
              style={[styles.filterChip, isSelected && styles.filterSelected]}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={rfqs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RfqCard
            rfq={item}
            quoteCount={
              mockCotizaciones.filter(
                (cotizacion) => cotizacion.rfqId === item.id,
              ).length
            }
            onPress={() => handleOpenRfq(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          rfqs.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState onCreate={handleCreateRfq} />}
      />
    </Screen>
  );
}

interface RfqCardProps {
  rfq: Rfq;
  quoteCount: number;
  onPress: () => void;
}

function RfqCard({ rfq, quoteCount, onPress }: RfqCardProps) {
  const status = statusCopy[rfq.status];
  const deadline = dateFormatter.format(new Date(rfq.fechaLimite));
  const quotesLabel =
    quoteCount === 1 ? "1 cotizacion" : `${quoteCount} cotizaciones`;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.rfqCard}>
        <View style={styles.cardHeader}>
          <Badge label={status.label} status={status.badge} />
          <Text style={styles.deadline}>Limite {deadline}</Text>
        </View>

        <Text style={styles.rfqTitle}>{rfq.titulo}</Text>
        <Text style={styles.rfqDescription} numberOfLines={2}>
          {rfq.descripcion}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.quoteCount}>{quotesLabel}</Text>
          <Text style={styles.openDetail}>Ver detalle</Text>
        </View>
      </Card>
    </Pressable>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No hay RFQs para este filtro</Text>
      <Text style={styles.emptyText}>
        Crea una nueva solicitud de cotizacion para empezar a recibir ofertas.
      </Text>
      <Button label="Crear RFQ" onPress={onCreate} style={styles.emptyButton} />
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 0,
  },
  header: {
    gap: 16,
    marginBottom: 18,
  },
  headerCopy: {
    gap: 6,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  createButton: {
    alignSelf: "stretch",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    minHeight: 38,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  filterSelected: {
    borderColor: colors.primary,
    backgroundColor: "#E3F1EA",
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextSelected: {
    color: colors.primary,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.82,
  },
  rfqCard: {
    gap: 12,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  deadline: {
    color: colors.textSecondary,
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },
  rfqTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 23,
  },
  rfqDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  quoteCount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  openDetail: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
    textAlign: "center",
  },
  emptyButton: {
    alignSelf: "stretch",
    marginTop: 6,
  },
});
