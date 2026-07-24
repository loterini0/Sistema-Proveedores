import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { Button } from '../../src/components/button';
import { Input } from '../../src/components/Input';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/theme/colors';

const schema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Login:', data);
      router.replace('/(tabs)/rfqs');
    } catch {
      Alert.alert('Error', 'Credenciales incorrectas');
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

        <Text style={styles.forgot} onPress={() => router.push('/auth/forgot-password')}>
          Olvidaste tu contrasena?
        </Text>

        <Button
          label="Iniciar sesion"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.btn}
        />

        <Text style={styles.register}>
          No tienes cuenta?{' '}
          <Text style={styles.registerLink} onPress={() => router.push('/auth/register')}>
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
  forgot: { color: colors.primary, fontSize: 14, textAlign: 'right', marginBottom: 24 },
  btn: { marginTop: 8 },
  register: { textAlign: 'center', marginTop: 24, fontSize: 14, color: colors.textSecondary },
  registerLink: { color: colors.primary, fontWeight: '600' },
});
