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

export default function EditarEmpresaScreen() {
  const empresaId = useAuthStore((state) => state.user?.empresaId);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [loadingInicial, setLoadingInicial] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!empresaId) return;

    Promise.all([categoriaService.listar(), empresaService.get(empresaId)])
      .then(([cats, empresa]) => {
        setCategorias(cats);
        if (empresa) {
          reset({
            razonSocial: empresa.razonSocial,
            nit: empresa.nit,
            ciudad: empresa.ciudad,
            departamento: empresa.departamento,
            telefono: empresa.telefono,
            website: empresa.website,
            descripcion: empresa.descripcion,
          });
          setCategoriaId(empresa.categoriaId ?? null);
        }
      })
      .finally(() => setLoadingInicial(false));
  }, [empresaId, reset]);

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;

    try {
      await empresaService.update(empresaId, {
        razonSocial: data.razonSocial,
        categoriaId: categoriaId ?? undefined,
        nit: data.nit || undefined,
        ciudad: data.ciudad || undefined,
        departamento: data.departamento || undefined,
        telefono: data.telefono || undefined,
        website: data.website || undefined,
        descripcion: data.descripcion || undefined,
      });

      Alert.alert("Listo", "Tu empresa quedó actualizada.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error as string) ?? "No se pudo actualizar la empresa"
        : "No se pudo actualizar la empresa";
      Alert.alert("Error", message);
    }
  };

  if (loadingInicial) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar empresa</Text>

        <Controller
          control={control}
          name="razonSocial"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Razón social *"
              onChangeText={onChange}
              value={value}
              error={errors.razonSocial?.message}
            />
          )}
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.chips}>
          {categorias.map((cat) => {
            const selected = categoriaId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategoriaId(cat.id)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Controller
          control={control}
          name="nit"
          render={({ field: { onChange, value } }) => (
            <Input label="NIT" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="ciudad"
          render={({ field: { onChange, value } }) => (
            <Input label="Ciudad" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="departamento"
          render={({ field: { onChange, value } }) => (
            <Input label="Departamento" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="telefono"
          render={({ field: { onChange, value } }) => (
            <Input label="Teléfono" keyboardType="phone-pad" onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Sitio web"
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
            <Input label="Descripción" multiline onChangeText={onChange} value={value} />
          )}
        />

        <Button
          label="Guardar cambios"
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
  title: { fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: colors.text, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
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
  submit: { marginTop: 12 },
});
