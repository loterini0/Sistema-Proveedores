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
  nombre: z.string().min(2, 'Minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
  confirmar: z.string().min(8, 'Minimo 8 caracteres'),
}).refine(data => data.password === data.confirmar, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmar'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Register:', data);
      Alert.alert('Listo', 'Revisa tu email para verificar tu cuenta.', [
        { text: 'OK', onPress: () => router.replace('/auth/login') }
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para comenzar</Text>
        </View>

        <Controller control={control} name="nombre" render={({ field: { onChange, value } }) => (
          <Input label="Nombre completo" placeholder="Juan Perez" onChangeText={onChange} value={value} error={errors.nombre?.message} />
        )} />

        <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
          <Input label="Email" placeholder="correo@empresa.com" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} value={value} error={errors.email?.message} />
        )} />

        <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
          <Input label="Contrasena" placeholder="Minimo 8 caracteres" secureTextEntry onChangeText={onChange} value={value} error={errors.password?.message} />
        )} />

        <Controller control={control} name="confirmar" render={({ field: { onChange, value } }) => (
          <Input label="Confirmar contrasena" placeholder="Repite tu contrasena" secureTextEntry onChangeText={onChange} value={value} error={errors.confirmar?.message} />
        )} />

        <Button label="Crear cuenta" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={styles.btn} />

        <Text style={styles.login}>
          Ya tienes cuenta?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/auth/login')}>
            Inicia sesion
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
  btn: { marginTop: 8 },
  login: { textAlign: 'center', marginTop: 24, fontSize: 14, color: colors.textSecondary },
  loginLink: { color: colors.primary, fontWeight: '600' },
});
