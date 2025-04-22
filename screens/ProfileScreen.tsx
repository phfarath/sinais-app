import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  // Add other routes as needed
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  name: TextStyle;
  subtitle: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  alertCard: ViewStyle;
  alertInfo: ViewStyle;
  alertTitle: TextStyle;
  alertDate: TextStyle;
  settingButton: ViewStyle;
  settingText: TextStyle;
  deleteButton: ViewStyle;
  deleteButtonText: TextStyle;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-circle" size={80} color="#4A90E2" />
          <Text style={styles.name}>Visitante</Text>
          <Text style={styles.subtitle}>Perfil Anônimo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Alertas</Text>
          <View style={styles.alertCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Alerta de Tempo</Text>
              <Text style={styles.alertDate}>Hoje, 14:30</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <MaterialCommunityIcons name="account-edit-outline" size={24} color="#4B5563" />
            <Text style={styles.settingText}>Editar Perfil</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#4B5563" />
            <Text style={styles.settingText}>Notificações</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <MaterialCommunityIcons name="shield-outline" size={24} color="#4B5563" />
            <Text style={styles.settingText}>Privacidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => navigation.navigate('Login')}
        >
          <MaterialCommunityIcons name="delete-outline" size={24} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Excluir meus dados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertInfo: {
    marginLeft: 16,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  alertDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 8,
  },
});