import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema Proveedores</Text>
      <Text style={styles.subtitle}>Plataforma B2B Colombia</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/auth/login')}>
        <Text style={styles.btnText}>Iniciar sesion</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => router.push('/auth/register')}>
        <Text style={[styles.btnText, styles.btnOutlineText]}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#1D6F42', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B6860', marginBottom: 48 },
  btn: { width: '100%', backgroundColor: '#1D6F42', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#1D6F42' },
  btnOutlineText: { color: '#1D6F42' },
});
