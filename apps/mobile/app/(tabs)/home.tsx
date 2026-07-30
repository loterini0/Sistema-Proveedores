import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search, ShieldCheck } from 'lucide-react-native';
import { colors } from '../src/theme/colors';
import { categoriaService } from '../src/services/categoria.service';
import type { Categoria } from '../src/services/mock.data';

export default function HomeScreen() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    categoriaService
      .listar()
      .then(setCategorias)
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, []);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

      <LinearGradient colors={[colors.primary, '#0F3D25']} style={styles.hero}>
        <Text style={styles.heroTitle}>Encuentra proveedores{'\n'}para tu empresa</Text>
        <Text style={styles.heroSubtitle}>
          Conectamos compradores y proveedores en Colombia con cotizaciones en minutos.
        </Text>
        <TouchableWithoutFeedback onPress={() => router.push('/empresas')}>
          <View style={styles.searchRow}>
            <Search size={18} color={colors.textSecondary} style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Que producto o servicio necesitas?"
              placeholderTextColor={colors.textSecondary}
              editable={false}
              pointerEvents="none"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={() => router.push('/empresas')}>
              <Text style={styles.searchBtnText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>

        {cargando ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : error ? (
          <Text style={styles.emptyText}>No se pudieron cargar las categorías.</Text>
        ) : categorias.length === 0 ? (
          <Text style={styles.emptyText}>Aun no hay categorías disponibles.</Text>
        ) : (
          <View style={styles.categoriesGrid}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/empresas?categoria=${categoria.slug}`)}
              >
                <Text style={styles.categoryName}>{categoria.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Eres proveedor?</Text>
        <Text style={styles.ctaSubtitle}>
          Registra tu empresa y conecta con compradores en toda Colombia.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/register')}>
          <Text style={styles.ctaBtnText}>Registrar mi empresa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Inicia sesion</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  hero: { padding: 28, paddingTop: 60, paddingBottom: 36 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: colors.white, lineHeight: 38, marginBottom: 12 },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 22, marginBottom: 24 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: 10, padding: 6 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingHorizontal: 10 },
  searchBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  searchBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  section: { padding: 20, paddingBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: colors.white },
  categoryName: { fontSize: 13, fontWeight: '500', color: colors.text },
  emptyText: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' },
  ctaBox: { margin: 20, padding: 24, backgroundColor: '#0F3D25', borderRadius: 16 },
  ctaTitle: { fontSize: 20, fontWeight: '800', color: colors.white, marginBottom: 8 },
  ctaSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20, marginBottom: 20 },
  ctaBtn: { backgroundColor: colors.white, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  ctaBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 24 },
  loginText: { fontSize: 14, color: colors.textSecondary },
  loginLink: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});