import React, { useMemo, useState } from "react";
import {Alert,StyleSheet,Text,TextInput,TouchableOpacity,View,} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { Badge } from "../../src/components/Badge";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import {mockCotizaciones,mockEmpresas,mockRfqs,mockRfqDestinatarios,} from "../../src/services/mock.data";
import { useAuthStore } from "../../src/store/auth.store";
import { puedeCotizar } from "../../src/utils/rfq-access";
import { colors } from "../../src/theme/colors";

interface CotizacionForm {
  precioUnitario: string;
  precioTotal: string;
  plazo: string;
  condiciones: string;
  observaciones: string;
}

const initialForm: CotizacionForm = {
  precioUnitario: "",
  precioTotal: "",
  plazo: "",
  condiciones: "",
  observaciones: "",
};

const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function RfqDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore((s) => s.user);
  const esProveedor = useAuthStore((s) => s.esProveedor);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const rfq = useMemo(() => mockRfqs.find((r) => r.id === id), [id]);

  const cotizaciones = useMemo(
    () => mockCotizaciones.filter((c) => c.rfqId === id),
    [id],
  );

  if (!rfq) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.notFound}>RFQ no encontrada</Text>
        </View>
      </Screen>
    );
  }

  const puedeEnviarCotizacion =
    esProveedor() &&
    puedeCotizar(rfq, user?.empresaId ?? null, mockRfqDestinatarios);

  const handlePickFiles = async () => {
    if (files.length >= 5) {
      Alert.alert("Límite alcanzado", "Solo puedes adjuntar hasta 5 archivos.");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/*",
      ],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const disponibles = 5 - files.length;

    setFiles((current) => [...current, ...result.assets.slice(0, disponibles)]);
  };

  return (
    <Screen scroll style={styles.screen}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>{rfq.titulo}</Text>

            <Badge
              label={rfq.status.toUpperCase()}
              status={
                rfq.status === "active"
                  ? "success"
                  : rfq.status === "awarded"
                    ? "warning"
                    : rfq.status === "closed"
                      ? "error"
                      : "default"
              }
            />
          </View>

          <Text style={styles.description}>{rfq.descripcion}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fecha límite</Text>
            <Text style={styles.infoValue}>
              {new Date(rfq.fechaLimite).toLocaleDateString("es-CO")}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>
              {rfq.privada ? "Privada" : "Pública"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cotizaciones recibidas</Text>

          {cotizaciones.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Todavía no existen cotizaciones para esta RFQ.
              </Text>
            </Card>
          ) : (
            cotizaciones.map((cotizacion) => {
              const proveedor = mockEmpresas.find(
                (e) => e.id === cotizacion.proveedorId,
              );

              return (
                <Card key={cotizacion.id} style={styles.quoteCard}>
                  <Text style={styles.quoteCompany}>
                    {proveedor?.razonSocial ?? "Proveedor"}
                  </Text>

                  <Text style={styles.quotePrice}>
                    {formatter.format(cotizacion.precioTotal)}
                  </Text>

                  <Text style={styles.quoteDeadline}>
                    Entrega: {cotizacion.plazoEntrega}
                  </Text>

                  {cotizacion.ganadora && (
                    <Badge label="Ganadora" status="success" />
                  )}
                </Card>
              );
            })
          )}
        </View>

        {puedeEnviarCotizacion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enviar cotización</Text>
            <Text style={styles.label}>Precio unitario</Text>

            <TextInput
              value={form.precioUnitario}
              keyboardType="numeric"
              placeholder="0"
              style={styles.input}
              onChangeText={(text) =>
                setForm((current) => ({
                  ...current,
                  precioUnitario: text.replace(/\D/g, ""),
                }))
              }
            />

            <Text style={styles.label}>Precio total</Text>

            <TextInput
              value={form.precioTotal}
              keyboardType="numeric"
              placeholder="0"
              style={styles.input}
              onChangeText={(text) =>
                setForm((current) => ({
                  ...current,
                  precioTotal: text.replace(/\D/g, ""),
                }))
              }
            />

            <Text style={styles.label}>Plazo de entrega</Text>

            <TextInput
              value={form.plazo}
              placeholder="Ej. 10 días hábiles"
              style={styles.input}
              onChangeText={(text) =>
                setForm((current) => ({
                  ...current,
                  plazo: text,
                }))
              }
            />

            <Text style={styles.label}>Condiciones</Text>

            <TextInput
              multiline
              style={styles.textArea}
              placeholder="Condiciones comerciales"
              value={form.condiciones}
              onChangeText={(text) =>
                setForm((current) => ({
                  ...current,
                  condiciones: text,
                }))
              }
            />

            <Text style={styles.label}>Observaciones</Text>

            <TextInput
              multiline
              style={styles.textArea}
              placeholder="Observaciones adicionales"
              value={form.observaciones}
              onChangeText={(text) =>
                setForm((current) => ({
                  ...current,
                  observaciones: text,
                }))
              }
            />

            <View style={styles.attachmentsHeader}>
              <Text style={styles.label}>Adjuntos</Text>

              <TouchableOpacity
                style={styles.attachButton}
                onPress={handlePickFiles}
                disabled={files.length >= 5}
              >
                <Text style={styles.attachButtonText}>Agregar archivo</Text>
              </TouchableOpacity>
            </View>

            {files.map((file) => (
              <View key={file.uri} style={styles.attachmentItem}>
                <Text numberOfLines={1} style={styles.attachmentName}>
                  {file.name}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setFiles((current) =>
                      current.filter((f) => f.uri !== file.uri),
                    )
                  }
                >
                  <Text style={styles.removeButtonText}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Button
              label="Enviar cotización"
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              onPress={async () => {
                setLoading(true);

                await new Promise((r) => setTimeout(r, 1000));

                setLoading(false);

                Alert.alert("Éxito", "Cotización enviada correctamente.");
              }}
            />
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    gap: 18,
  },
  header: {
    gap: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
  },
  infoBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
  section: {
    marginTop: 10,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 18,
  },
  emptyText: { color: colors.textSecondary, textAlign: "center" },
  quoteCard: { gap: 6 },
  quoteCompany: { fontWeight: "700", fontSize: 16, color: colors.text },
  quotePrice: { fontSize: 18, color: colors.primary, fontWeight: "800" },
  quoteDeadline: { color: colors.textSecondary },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
    color: colors.text,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, fontWeight: "700", color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    color: colors.text,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: colors.white,
    color: colors.text,
  },
  attachmentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  attachButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  attachButtonText: { color: colors.primary, fontWeight: "700" },
  attachmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
  },
  attachmentName: { flex: 1, color: colors.text, marginRight: 8 },
  removeButtonText: { color: colors.error, fontWeight: "700" },
  submitButton: { marginTop: 20 },
});
