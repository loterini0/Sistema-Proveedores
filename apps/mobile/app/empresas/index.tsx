import { View, Text, StyleSheet } from 'react-native';

export default function EmpresasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Directorio de Empresas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1917' },
});
