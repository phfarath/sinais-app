import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

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
        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.header}
        >
          <MaterialCommunityIcons name="account-circle" size={80} color="#4A90E2" />
          <Text style={styles.name}>Visitante</Text>
          <Text style={styles.subtitle}>Perfil Anônimo</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Alertas</Text>
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.alertCard}
          >
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Alerta de Tempo</Text>
              <Text style={styles.alertDate}>Hoje, 14:30</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.settingButton}
          >
            <MaterialCommunityIcons name="account-edit-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Editar Perfil</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.settingButton}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Notificações</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.settingButton}
          >
            <MaterialCommunityIcons name="shield-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Privacidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </LinearGradient>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertInfo: {
    marginLeft: 16,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  alertDate: {
    fontSize: 14,
    color: '#64748B',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    margin: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
});