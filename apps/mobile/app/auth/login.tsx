import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';

const schema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Login:', data);
      router.replace('/empresas');
    } catch {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesion</Text>
      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={[styles.input, errors.email && styles.inputError]} onChangeText={onChange} value={value} placeholder="correo@empresa.com" keyboardType="email-address" autoCapitalize="none" />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        </View>
      )} />
      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Contrasena</Text>
          <TextInput style={[styles.input, errors.password && styles.inputError]} onChangeText={onChange} value={value} placeholder="••••••••" secureTextEntry />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>
      )} />
      <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
        <Text style={styles.link}>Olvidaste tu contrasena?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>No tienes cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1917', marginBottom: 32 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#1A1917', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2DFD8', borderRadius: 8, padding: 12, fontSize: 15 },
  inputError: { borderColor: '#B91C1C' },
  error: { color: '#B91C1C', fontSize: 12, marginTop: 4 },
  btn: { backgroundColor: '#1D6F42', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#1D6F42', textAlign: 'center', marginBottom: 12, fontSize: 14 },
});
