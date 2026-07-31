import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/colors";
import { rfqService } from "../../src/services/rfq.service";

const schema = z.object({
  precioUnitario: z.string().optional(),
  precioTotal: z.string().optional(),
  plazoEntrega: z.string().optional(),
  condicionesPago: z.string().optional(),
  observaciones: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CotizarScreen() {
  const { rfqId } = useLocalSearchParams<{ rfqId: string }>();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await rfqService.submitCotizacion(rfqId, data);
      Alert.alert("Cotización enviada", "El comprador ya puede verla.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error as string) ?? "No se pudo enviar la cotización"
        : "No se pudo enviar la cotización";
      Alert.alert("Error", message);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Enviar cotización</Text>
        <Text style={styles.subtitle}>
          Todos los campos son opcionales, pero entre más completos, más fácil es que te elijan.
        </Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Controller
              control={control}
              name="precioUnitario"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Precio unitario"
                  placeholder="3800"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View style={styles.half}>
            <Controller
              control={control}
              name="precioTotal"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Precio total"
                  placeholder="1900000"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="plazoEntrega"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Plazo de entrega"
              placeholder="7 días hábiles"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="condicionesPago"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Condiciones de pago"
              placeholder="50% anticipo, 50% contraentrega"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="observaciones"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Observaciones"
              placeholder="Notas adicionales para el comprador"
              multiline
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Button
          label="Enviar cotización"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.submit}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 26, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 6, marginBottom: 20 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  submit: { marginTop: 12 },
});
