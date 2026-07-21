import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../src/components/button';
import { Screen } from '../src/components/Screen';
import { colors } from '../src/theme/colors';

export default function HomeScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>B2B</Text>
          </View>
          <Text style={styles.title}>Sistema Proveedores</Text>
          <Text style={styles.subtitle}>Conectamos compradores y proveedores en Colombia</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Iniciar sesion" onPress={() => router.push('/auth/login')} />
          <View style={styles.gap} />
          <Button label="Registrarse" variant="outline" onPress={() => router.push('/auth/register')} />
          <Text style={styles.proveedorText}>
            ¿Eres proveedor?{' '}
            <Text style={styles.proveedorLink} onPress={() => router.push('/auth/register')}>
              Registra tu empresa
            </Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 24 },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBox: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  logoText: { color: colors.white, fontSize: 24, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  actions: { paddingBottom: 32 },
  gap: { height: 12 },
  proveedorText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: colors.textSecondary },
  proveedorLink: { color: colors.primary, fontWeight: '600' },
});
