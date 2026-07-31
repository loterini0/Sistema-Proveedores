import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import axios from "axios";

import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/colors";
import { empresaService } from "../../src/services/empresa.service";
import { categoriaService } from "../../src/services/categoria.service";
import { Categoria } from "../../src/services/mock.data";
import { useAuthStore } from "../../src/store/auth.store";

const schema = z.object({
  razonSocial: z.string().min(2, "Mínimo 2 caracteres"),
  nit: z.string().optional(),
  ciudad: z.string().optional(),
  departamento: z.string().optional(),
  telefono: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), {
      message: "Debe incluir http:// o https://",
    }),
  descripcion: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NuevaEmpresaScreen() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [categoriaError, setCategoriaError] = useState<string | null>(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    categoriaService
      .listar()
      .then(setCategorias)
      .catch(() => setCategorias([]))
      .finally(() => setLoadingCategorias(false));
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!categoriaId) {
      setCategoriaError("Elige una categoría");
      return;
    }
    setCategoriaError(null);

    try {
      await empresaService.create({
        razonSocial: data.razonSocial,
        categoriaId,
        nit: data.nit || undefined,
        ciudad: data.ciudad || undefined,
        departamento: data.departamento || undefined,
        telefono: data.telefono || undefined,
        website: data.website || undefined,
        descripcion: data.descripcion || undefined,
      });

      // refresca el usuario en el store para que empresaId ya no sea null
      // en el resto de la app (perfil, publicar RFQ, cotizar, etc.)
      await restoreSession();

      Alert.alert("Listo", "Tu empresa quedó registrada.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error as string) ?? "No se pudo registrar la empresa"
        : "No se pudo registrar la empresa";
      Alert.alert("Error", message);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registra tu empresa</Text>
        <Text style={styles.subtitle}>
          La necesitas para publicar RFQs o enviar cotizaciones.
        </Text>

        <Controller
          control={control}
          name="razonSocial"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Razón social *"
              placeholder="Textiles Ana SAS"
              onChangeText={onChange}
              value={value}
              error={errors.razonSocial?.message}
            />
          )}
        />

        <Text style={styles.label}>Categoría *</Text>
        {loadingCategorias ? (
          <ActivityIndicator color={colors.primary} style={{ marginBottom: 16 }} />
        ) : (
          <View style={styles.chips}>
            {categorias.map((cat) => {
              const selected = categoriaId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setCategoriaId(cat.id);
                    setCategoriaError(null);
                  }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {cat.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {!!categoriaError && <Text style={styles.error}>{categoriaError}</Text>}

        <Controller
          control={control}
          name="nit"
          render={({ field: { onChange, value } }) => (
            <Input label="NIT" placeholder="900123456-1" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="ciudad"
          render={({ field: { onChange, value } }) => (
            <Input label="Ciudad" placeholder="Manizales" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="departamento"
          render={({ field: { onChange, value } }) => (
            <Input label="Departamento" placeholder="Caldas" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="telefono"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Teléfono"
              placeholder="3001234567"
              keyboardType="phone-pad"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Sitio web"
              placeholder="https://miempresa.com"
              autoCapitalize="none"
              keyboardType="url"
              onChangeText={onChange}
              value={value}
              error={errors.website?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="descripcion"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Descripción"
              placeholder="A qué se dedica tu empresa"
              multiline
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Button
          label="Registrar empresa"
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
  label: { fontSize: 14, fontWeight: "500", color: colors.text, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: "500" },
  chipTextSelected: { color: colors.white },
  error: { color: colors.error, fontSize: 12, marginBottom: 16 },
  submit: { marginTop: 12 },
});
