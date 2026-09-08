import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function MantenimientoScreen({ navigation }: any) {
  
  // Función para abrir la galería y seleccionar la moto
  const abrirGaleria = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cargar la moto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Navegamos al editor y le pasamos la foto elegida
      navigation.navigate('SimuladorEditor', { uriFotoMoto: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER CON BOTÓN DE REGRESO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Mantenimiento</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Botón Principal (AHORA ABRE LA GALERÍA) */}
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={abrirGaleria}
        >
          <Ionicons name="camera-outline" size={48} color="#3b82f6" />
          <Text style={styles.mainButtonText}>Iniciar Nuevo Diseño</Text>
          <Text style={styles.subButtonText}>(Seleccionar Foto de Galería)</Text>
        </TouchableOpacity>

        {/* Sección Central: Progreso */}
        <Text style={styles.sectionTitle}>Estado del Diseño Actual</Text>
        <View style={styles.cardContainer}>
          <View style={styles.progressItem}>
            <View style={[styles.circle, { borderColor: '#ef4444' }]}><Text style={styles.circleText}>40%</Text></View>
            <Text style={styles.progressLabel}>Color Base</Text>
          </View>
          <View style={styles.progressItem}>
            <View style={[styles.circle, { borderColor: '#10b981' }]}><Text style={styles.circleText}>75%</Text></View>
            <Text style={styles.progressLabel}>Stickers (Izq)</Text>
          </View>
          <View style={styles.progressItem}>
            <View style={[styles.circle, { borderColor: '#f59e0b' }]}><Text style={styles.circleText}>15%</Text></View>
            <Text style={styles.progressLabel}>Stickers (Der)</Text>
          </View>
        </View>

        {/* Sección Inferior: Acciones Rápidas */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="pricetag-outline" size={28} color="#10b981" />
            <Text style={styles.gridText}>Añadir Sticker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="color-palette-outline" size={28} color="#3b82f6" />
            <Text style={styles.gridText}>Crear Paleta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('SimuladorLibreria')}>
            <Ionicons name="images-outline" size={28} color="#8b5cf6" />
            <Text style={styles.gridText}>Mis Diseños</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="share-social-outline" size={28} color="#64748b" />
            <Text style={styles.gridText}>Compartir</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff' },
  backButton: { padding: 5 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  content: { padding: 20, paddingBottom: 40 },
  mainButton: { backgroundColor: '#fff', height: 160, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  mainButtonText: { color: '#0f172a', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  subButtonText: { color: '#64748b', fontSize: 14, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  progressItem: { alignItems: 'center' },
  circle: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  circleText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  progressLabel: { color: '#64748b', fontSize: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { backgroundColor: '#fff', width: '48%', height: 100, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  gridText: { color: '#0f172a', fontSize: 14, fontWeight: '600', marginTop: 8 }
});