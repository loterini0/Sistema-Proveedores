import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: llamar authService.register(data)
      console.log('Register:', data);
      Alert.alert('¡Listo!', 'Revisa tu email para verificar tu cuenta.', [
        { text: 'OK', onPress: () => router.replace('/auth/login') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={[styles.input, errors.nombre && styles.inputError]}
              onChangeText={onChange}
              value={value}
              placeholder="Juan Pérez"
            />
            {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              onChangeText={onChange}
              value={value}
              placeholder="correo@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              onChangeText={onChange}
              value={value}
              placeholder="••••••••"
              secureTextEntry
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1917', marginBottom: 32 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#1A1917', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2DFD8', borderRadius: 8, padding: 12, fontSize: 15 },
  inputError: { borderColor: '#B91C1C' },
  error: { color: '#B91C1C', fontSize: 12, marginTop: 4 },
  btn: { backgroundColor: '#1D6F42', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#1D6F42', textAlign: 'center', fontSize: 14 },
});
