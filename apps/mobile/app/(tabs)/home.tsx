import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, ImageBackground, Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { categoriaService } from '../../src/services/categoria.service';
import { empresaService } from '../../src/services/empresa.service';
import { productoService } from '../../src/services/producto.service';
import { useAuthStore } from '../../src/store/auth.store';
import type { Categoria, Empresa } from '../../src/services/mock.data';

interface ProductoReciente {
  id: string;
  nombre: string;
  precio: string;
  imagenUrl: string;
  empresaId: string;
  empresaNombre: string;
}

export default function HomeScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [query, setQuery] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [destacadas, setDestacadas] = useState<Empresa[]>([]);
  const [productos, setProductos] = useState<ProductoReciente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      categoriaService.listar().catch(() => []),
      empresaService.search({ destacada: true, limit: 6 } as any).catch(() => []),
      productoService.recientes().catch(() => []),
    ]).then(([cats, emps, prods]) => {
      setCategorias(cats);
      setDestacadas(emps);
      setProductos(prods);
      setCargando(false);
    });
  }, []);

  const buscar = () => {
    router.push(query.trim() ? `/empresas?q=${encodeURIComponent(query.trim())}` : '/empresas');
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200' }}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          {!isAuthenticated && (
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.topBarBtnGhost}>
                <Text style={styles.topBarBtnGhostText}>Iniciar sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.topBarBtn}>
                <Text style={styles.topBarBtnText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.heroTitle}>
            Encuentra proveedores{'\n'}para tu empresa
          </Text>
          <Text style={styles.heroSubtitle}>
            Conectamos compradores y proveedores en Colombia con cotizaciones en minutos.
          </Text>

          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Que producto o servicio necesitas?"
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={buscar}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={buscar}>
              <Text style={styles.searchBtnText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        {cargando ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : categorias.length === 0 ? (
          <Text style={styles.emptyText}>Aun no hay categorías disponibles.</Text>
        ) : (
          <View style={styles.grid}>
            {categorias.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/empresas?categoriaId=${c.id}`)}
              >
                <Text style={styles.categoryName}>{c.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {!cargando && destacadas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresas destacadas</Text>
          {destacadas.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={styles.empresaCard}
              onPress={() => router.push(`/empresas/${e.id}`)}
            >
              <View style={styles.empresaAvatar}>
                <Text style={styles.empresaAvatarText}>{e.razonSocial.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.empresaTitleRow}>
                  <Text style={styles.empresaNombre} numberOfLines={1}>{e.razonSocial}</Text>
                  {e.verificada && (
                    <View style={styles.verificadoBadge}>
                      <Ionicons name="shield-checkmark-outline" size={11} color={colors.white} />
                      <Text style={styles.verificadoText}>Verificado</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.empresaMeta}>{e.ciudad}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!cargando && productos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos recientes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productos.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.productoCard}
                onPress={() => router.push(`/productos/${p.id}`)}
              >
                <Image source={{ uri: p.imagenUrl }} style={styles.productoImg} />
                <Text style={styles.productoNombre} numberOfLines={2}>{p.nombre}</Text>
                <Text style={styles.productoEmpresa} numberOfLines={1}>{p.empresaNombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>¿Eres empresario?</Text>
        <Text style={styles.ctaSubtitle}>
          Registra tu empresa y conecta con compradores en toda Colombia.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/register')}>
          <Text style={styles.ctaBtnText}>Registrar mi empresa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Sistema Proveedores</Text>
        <Text style={styles.footerText}>
          Conectamos compradores y proveedores en el Eje Cafetero y toda Colombia.
        </Text>
        {!isAuthenticated && (
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Inicia sesion</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 420 },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(15,61,37,0.75)', justifyContent: 'center', padding: 24, paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, position: 'absolute', top: 16, right: 16, left: 16 },
  topBarBtnGhost: { paddingHorizontal: 16, paddingVertical: 9 },
  topBarBtnGhostText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  topBarBtn: { backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8 },
  topBarBtnText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.white, lineHeight: 36, marginBottom: 12 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 22 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 10, padding: 6 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingHorizontal: 10 },
  searchBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  searchBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  section: { padding: 20, paddingBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14 },
  emptyText: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: colors.white },
  categoryName: { fontSize: 13, fontWeight: '500', color: colors.text },
  empresaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 10 },
  empresaAvatar: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  empresaAvatarText: { fontSize: 18, fontWeight: '700', color: colors.white },
  empresaTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  empresaNombre: { fontSize: 15, fontWeight: '600', color: colors.text, flexShrink: 1 },
  empresaMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  verificadoBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#22C55E', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  verificadoText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  productoCard: { width: 140, marginRight: 12, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  productoImg: { width: '100%', height: 100 },
  productoNombre: { fontSize: 12, fontWeight: '600', color: colors.text, padding: 8, paddingBottom: 2 },
  productoEmpresa: { fontSize: 11, color: colors.textSecondary, paddingHorizontal: 8, paddingBottom: 8 },
  ctaBox: { margin: 20, padding: 24, backgroundColor: '#0F3D25', borderRadius: 16 },
  ctaTitle: { fontSize: 20, fontWeight: '800', color: colors.white, marginBottom: 8 },
  ctaSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20, marginBottom: 20 },
  ctaBtn: { backgroundColor: colors.white, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  ctaBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  footer: { padding: 24, paddingTop: 8, alignItems: 'center' },
  footerTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  footerText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  loginRow: { flexDirection: 'row' },
  loginText: { fontSize: 14, color: colors.textSecondary },
  loginLink: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});