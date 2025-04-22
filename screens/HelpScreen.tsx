import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Help: undefined;
  // Add other routes as needed
};

type HelpScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Help'>;
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  moodCard: ViewStyle;
  moodTitle: TextStyle;
  moodOptions: ViewStyle;
  moodButton: ViewStyle;
  moodEmoji: TextStyle;
  chatSection: ViewStyle;
  chatButton: ViewStyle;
  appointmentButton: ViewStyle;
  chatInfo: ViewStyle;
  chatTitle: TextStyle;
  chatSubtitle: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  contactCard: ViewStyle;
  contactInfo: ViewStyle;
  contactTitle: TextStyle;
  contactSubtitle: TextStyle;
}

export default function HelpScreen({ navigation }: HelpScreenProps) {
  const insets = useSafeAreaInsets();

  const moodOptions = ['😔', '😐', '🙂', '😊'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <Text style={styles.title}>Central de Ajuda</Text>
        
        <View style={styles.moodCard}>
          <Text style={styles.moodTitle}>Como você se sente hoje?</Text>
          <View style={styles.moodOptions}>
            {moodOptions.map((mood, index) => (
              <TouchableOpacity key={index} style={styles.moodButton}>
                <Text style={styles.moodEmoji}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>Converse com Alguém</Text>
        <TouchableOpacity style={styles.chatButton}>
          <MaterialCommunityIcons name="chat-processing" size={24} color="#4A90E2" />
          <View style={styles.chatInfo}>
            <Text style={styles.chatTitle}>Chat de Apoio 24/7</Text>
            <Text style={styles.chatSubtitle}>Disponível agora</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appointmentButton}>
          <MaterialCommunityIcons name="calendar-clock" size={24} color="#4A90E2" />
          <View style={styles.chatInfo}>
            <Text style={styles.chatTitle}>Agendar Consulta</Text>
            <Text style={styles.chatSubtitle}>Psicólogo voluntário</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatos de Apoio</Text>
          
          <TouchableOpacity style={styles.contactCard}>
            <MaterialCommunityIcons name="phone" size={24} color="#4A90E2" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>CVV - Centro de Valorização da Vida</Text>
              <Text style={styles.contactSubtitle}>Ligação gratuita: 188</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <MaterialCommunityIcons name="account-group" size={24} color="#4A90E2" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Grupos de Apoio Online</Text>
              <Text style={styles.contactSubtitle}>Encontre ajuda na sua região</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <MaterialCommunityIcons name="chat" size={24} color="#4A90E2" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Chat com Especialista</Text>
              <Text style={styles.contactSubtitle}>Disponível 24/7</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  chatSection: {
    marginBottom: 24,
  },
  chatButton: {
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
  appointmentButton: {
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
  chatInfo: {
    marginLeft: 16,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  moodCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    padding: 12,
  },
  moodEmoji: {
    fontSize: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactCard: {
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
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});