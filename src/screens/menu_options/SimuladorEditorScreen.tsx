import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SimuladorEditorScreen({ route, navigation }: any) {
  // Recibimos la foto de la galería
  const { uriFotoMoto } = route.params || { uriFotoMoto: 'https://via.placeholder.com/800x600/cbd5e1/0f172a?text=Foto+de+tu+Moto' };

  // Variables matemáticas para las animaciones
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current; 
  const lastScale = useRef(1); // Guarda el tamaño para el siguiente toque
  
  const [isStickerActive, setIsStickerActive] = useState(true);

  // 1. PAN RESPONDER PARA MOVER (Arrastrar)
  const movePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
        setIsStickerActive(true);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => { pan.flattenOffset(); }
    })
  ).current;

  // 2. PAN RESPONDER PARA ESCALAR (Hacer grande/chiquito)
  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true, // Evita que "Mover" robe el toque
      onPanResponderGrant: () => {
        scale.setOffset(lastScale.current - 1);
        scale.setValue(1);
      },
      onPanResponderMove: (e, gestureState) => {
        // Dividimos entre 150 para que el crecimiento sea suave y controlable
        const newScale = 1 + (gestureState.dx / 150);
        scale.setValue(newScale);
      },
      onPanResponderRelease: () => {
        scale.flattenOffset();
        lastScale.current = (scale as any)._value; // Guardamos el tamaño final
      }
    })
  ).current;

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Mi Moto (Editor)</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={{ marginRight: 10 }}><Ionicons name="arrow-undo-outline" size={24} color="#64748b" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="checkmark-circle" size={28} color="#10b981" /></TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.canvas} 
        activeOpacity={1} 
        onPress={() => setIsStickerActive(false)}
      >
        <Image source={{ uri: uriFotoMoto }} style={styles.bikeImage} resizeMode="contain" />

        {/* CONTENEDOR PRINCIPAL DEL STICKER (Aplica movimiento y escala) */}
        <Animated.View
          style={[
            styles.stickerWrapper, 
            { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }] }
          ]}
        >
          <View style={[styles.stickerBorder, isStickerActive && styles.stickerBorderActive]}>
            
            {/* Solo el centro (la imagen) sirve para mover */}
            <Animated.View {...movePanResponder.panHandlers}>
              <Image source={{ uri: 'https://via.placeholder.com/120x120/ef4444/ffffff?text=Sticker' }} style={styles.stickerImage} />
            </Animated.View>

            {isStickerActive && (
              <>
                <View style={[styles.handle, styles.handleTopLeft]} />
                <View style={[styles.handle, styles.handleTopRight]} />
                <View style={[styles.handle, styles.handleBottomLeft]} />
                
                {/* LA ESQUINA INFERIOR DERECHA AHORA CONTROLA LA ESCALA */}
                <Animated.View 
                  style={[styles.handle, styles.handleBottomRight, { backgroundColor: '#10b981' }]} 
                  {...resizePanResponder.panHandlers}
                />
                
                <View style={styles.handleCenter}><Ionicons name="sync-outline" size={16} color="#fff" /></View>
              </>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.floatingRightPanel}>
        <TouchableOpacity style={styles.panelButton}><Ionicons name="add-circle" size={36} color="#3b82f6" /></TouchableOpacity>
        <TouchableOpacity style={styles.panelButton}><Ionicons name="color-filter" size={32} color="#10b981" /></TouchableOpacity>
        <TouchableOpacity style={styles.panelButton}><Ionicons name="layers" size={32} color="#f59e0b" /></TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff', zIndex: 10 },
  backButton: { padding: 5 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  canvas: { flex: 1, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  bikeImage: { width: '100%', height: '100%', position: 'absolute' },
  stickerWrapper: { position: 'absolute' },
  stickerBorder: { padding: 10, borderWidth: 2, borderColor: 'transparent' },
  stickerBorderActive: { borderColor: '#3b82f6', borderStyle: 'dashed', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  stickerImage: { width: 120, height: 120, resizeMode: 'contain' },
  handle: { position: 'absolute', width: 20, height: 20, backgroundColor: '#fff', borderRadius: 10, borderWidth: 2, borderColor: '#3b82f6', zIndex: 20 },
  handleTopLeft: { top: -10, left: -10 },
  handleTopRight: { top: -10, right: -10 },
  handleBottomLeft: { bottom: -10, left: -10 },
  handleBottomRight: { bottom: -10, right: -10 }, // Esta esquina será verde para destacarla
  handleCenter: { position: 'absolute', top: -30, alignSelf: 'center', backgroundColor: '#3b82f6', borderRadius: 12, padding: 2 },
  floatingRightPanel: { position: 'absolute', right: 15, top: '35%', backgroundColor: '#fff', borderRadius: 16, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  panelButton: { marginVertical: 12 }
});