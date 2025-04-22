import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AlertScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function AlertScreen({ navigation }: AlertScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.card}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#4A90E2" />
        <Text style={styles.title}>Alerta de Comportamento</Text>
        <Text style={styles.message}>
          Você jogou por 3 horas hoje. Que tal fazer uma pausa?
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Help')}
          >
            <Text style={styles.primaryButtonText}>Buscar ajuda</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Educational')}
          >
            <Text style={styles.secondaryButtonText}>Ver alternativas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.tertiaryButton]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.tertiaryButtonText}>Ignorar por enquanto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  card: ViewStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  primaryButton: ViewStyle;
  secondaryButton: ViewStyle;
  tertiaryButton: ViewStyle;
  [key: string]: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  tertiaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});