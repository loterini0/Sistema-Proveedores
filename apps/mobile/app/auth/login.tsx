import axios from 'axios';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { Button } from '../../src/components/button';
import { Input } from '../../src/components/Input';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/theme/colors';
import { authService } from '../../src/services/api';
import { useAuthStore } from '../../src/store/auth.store';

const schema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    try {
      const {data} = await authService.login(values);

      await setUser(data.user, data.accessToken, data.refreshToken);
      router.replace("/home")
    } catch (error) {
      const message = axios.isAxiosError(error)
      ? error.response?.data?.error ??
        error.response?.data?.message ??
        "No fue posible iniciar sesión"
      : "No fue posible iniciar sesion"

      Alert.alert("Error", message)
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesion para continuar</Text>
        </View>

        <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
          <Input
            label="Email"
            placeholder="correo@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )} />

        <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
          <Input
            label="Contrasena"
            placeholder="Minimo 8 caracteres"
            secureTextEntry
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )} />

        <Text style={styles.link} onPress={() => router.push('/auth/forgot-password')}>
          ¿Olvidaste tu contrasena?
        </Text>

        <Button
          label="Iniciar sesion"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />

        <Text style={styles.footer}>
          No tienes cuenta?{" "}
          <Text style={styles.link} onPress={() => router.push('/auth/register')}>
            Registrate
          </Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { marginTop: 24, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 6 },
  link: { color: colors.primary, fontWeight: "600"},
  footer: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
    color: colors.textSecondary
  }
});
