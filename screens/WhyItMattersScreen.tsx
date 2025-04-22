import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  WhyItMatters: undefined;
  // Add other routes as needed
};

type WhyItMattersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WhyItMatters'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  statsCard: ViewStyle;
  statItem: ViewStyle;
  statNumber: TextStyle;
  statDesc: TextStyle;
  divider: ViewStyle;
  quoteCard: ViewStyle;
  quote: TextStyle;
  infoCards: ViewStyle;
  infoCard: ViewStyle;
  infoTitle: TextStyle;
  infoDesc: TextStyle;
}

export default function WhyItMattersScreen({ navigation }: WhyItMattersScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <View style={styles.header}>
          <MaterialCommunityIcons name="heart-pulse" size={60} color="#4A90E2" />
          <Text style={styles.title}>Por que isso importa?</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3,2M</Text>
            <Text style={styles.statDesc}>brasileiros em risco de vício em apostas</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>88%</Text>
            <Text style={styles.statDesc}>não percebem o início do vício</Text>
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quote}>
            "Não estamos aqui para proibir, mas para proteger."
          </Text>
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="brain" size={32} color="#4A90E2" />
            <Text style={styles.infoTitle}>Vício Silencioso</Text>
            <Text style={styles.infoDesc}>
              O vício em apostas pode se desenvolver gradualmente, sem sinais óbvios
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="hand-heart" size={32} color="#4A90E2" />
            <Text style={styles.infoTitle}>Nossa Missão</Text>
            <Text style={styles.infoDesc}>
              Usar tecnologia para promover um comportamento mais consciente
            </Text>
          </View>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 8,
  },
  statDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  quoteCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  quote: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
  },
  infoCards: {
    flexDirection: 'row',
    gap: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});