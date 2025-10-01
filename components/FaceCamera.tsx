import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FaceCameraProps {
  onCapture: (imageUri: string) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  showFaceDetection?: boolean;
}

export default function FaceCamera({
  onCapture,
  onClose,
  title = "Posicione seu rosto",
  subtitle = "Centralize seu rosto no círculo",
  showFaceDetection = true
}: FaceCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true); // Always true for now to allow capture
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    setIsCapturing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
      });

      if (photo.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.permissionText}>Verificando permissões da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#DC2626" />
        <Text style={styles.permissionText}>Sem acesso à câmera</Text>
        <Text style={styles.permissionSubtext}>
          Você precisa permitir o acesso à câmera para usar o reconhecimento facial.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Permitir Acesso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        onCameraReady={() => setCameraReady(true)}
        enableTorch={false}
      />
      
      {/* Overlay positioned absolutely on top of camera */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Face Detection Overlay */}
        <View style={styles.faceDetectionArea}>
          {showFaceDetection && (
            <View style={[
              styles.faceGuide,
              faceDetected ? styles.faceGuideDetected : styles.faceGuideNotDetected
            ]}>
              <MaterialCommunityIcons
                name="face-recognition"
                size={48}
                color={faceDetected ? "#10B981" : "#9CA3AF"}
              />
            </View>
          )}
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {showFaceDetection && (
              <Text style={[
                styles.statusText,
                faceDetected ? styles.statusDetected : styles.statusNotDetected
              ]}>
                {faceDetected ? "Rosto detectado" : "Procure um rosto"}
              </Text>
            )}
          </View>
        </View>

        {/* Capture Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              !cameraReady && styles.captureButtonDisabled
            ]}
            onPress={handleCapture}
            disabled={!cameraReady || isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceDetectionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  faceGuide: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  faceGuideDetected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  faceGuideNotDetected: {
    borderColor: '#9CA3AF',
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusDetected: {
    color: '#10B981',
  },
  statusNotDetected: {
    color: '#F59E0B',
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});