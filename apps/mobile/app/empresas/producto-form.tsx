import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/colors";
import { empresaService } from "../../src/services/empresa.service";
import { useAuthStore } from "../../src/store/auth.store";

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  descripcion: z.string().optional(),
  precio: z.string().optional(),
  imagenUrl: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), {
      message: "Debe ser una URL válida (http:// o https://)",
    }),
});

type FormData = z.infer<typeof schema>;

export default function ProductoFormScreen() {
  const { productoId } = useLocalSearchParams<{ productoId?: string }>();
  const empresaId = useAuthStore((state) => state.user?.empresaId);
  const esEdicion = !!productoId;
  const [loadingInicial, setLoadingInicial] = useState(esEdicion);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!esEdicion || !empresaId) return;

    empresaService
      .getProductos(empresaId)
      .then((productos) => {
        const producto = productos.find((p) => p.id === productoId);
        if (producto) {
          reset({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: String(producto.precio ?? ""),
            imagenUrl: producto.imagenUrl,
          });
        }
      })
      .finally(() => setLoadingInicial(false));
  }, [esEdicion, empresaId, productoId, reset]);

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;

    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      precio: data.precio || undefined,
      imagenUrl: data.imagenUrl || undefined,
    };

    try {
      if (esEdicion) {
        await empresaService.updateProducto(empresaId, productoId!, payload);
      } else {
        await empresaService.createProducto(empresaId, payload);
      }
      router.back();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error as string) ?? "No se pudo guardar el producto"
        : "No se pudo guardar el producto";
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
        <Text style={styles.title}>{esEdicion ? "Editar producto" : "Nuevo producto"}</Text>

        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nombre *"
              placeholder="Ej. Tela de algodón blanca"
              onChangeText={onChange}
              value={value}
              error={errors.nombre?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="descripcion"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Descripción"
              placeholder="Detalles del producto o servicio"
              multiline
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="precio"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Precio"
              placeholder="50000"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="imagenUrl"
          render={({ field: { onChange, value } }) => (
            <Input
              label="URL de imagen"
              placeholder="https://..."
              autoCapitalize="none"
              keyboardType="url"
              onChangeText={onChange}
              value={value}
              error={errors.imagenUrl?.message}
            />
          )}
        />

        <Button
          label={esEdicion ? "Guardar cambios" : "Crear producto"}
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
  submit: { marginTop: 12 },
});
