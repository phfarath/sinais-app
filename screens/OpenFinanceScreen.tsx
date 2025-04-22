import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  OpenFinance: undefined;
  // Add other routes as needed
};

type OpenFinanceScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OpenFinance'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  message: TextStyle;
  comparisonCard: ViewStyle;
  chartTitle: TextStyle;
  chartContainer: ViewStyle;
  chartBar: ViewStyle;
  barFill: ViewStyle;
  barLabel: TextStyle;
  barValue: TextStyle;
  infoCard: ViewStyle;
  infoText: TextStyle;
}

export default function OpenFinanceScreen({ navigation }: OpenFinanceScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <View style={styles.header}>
          <MaterialCommunityIcons name="bank" size={60} color="#4A90E2" />
          <Text style={styles.title}>Open Finance</Text>
          <Text style={styles.subtitle}>Conecte seus dados bancários</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.message}>
            Se conectássemos seus dados bancários, poderíamos comparar apostas com gastos em saúde, lazer e educação
          </Text>
        </View>

        <View style={styles.comparisonCard}>
          <Text style={styles.chartTitle}>Simulação de Gastos Mensais</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartBar}>
              <View style={[styles.barFill, { height: '70%', backgroundColor: '#EF4444' }]} />
              <Text style={styles.barLabel}>Apostas</Text>
              <Text style={styles.barValue}>R$ 700</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barFill, { height: '30%', backgroundColor: '#10B981' }]} />
              <Text style={styles.barLabel}>Investimentos</Text>
              <Text style={styles.barValue}>R$ 300</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barFill, { height: '20%', backgroundColor: '#4A90E2' }]} />
              <Text style={styles.barLabel}>Lazer</Text>
              <Text style={styles.barValue}>R$ 200</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#F59E0B" />
          <Text style={styles.infoText}>
            Se você investisse o valor das apostas, em 1 ano teria aproximadamente R$ 8.400 + rendimentos
          </Text>
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
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  card: {
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
  message: {
    fontSize: 18,
    color: '#1F2937',
    lineHeight: 28,
    textAlign: 'center',
  },
  comparisonCard: {
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
    alignItems: 'flex-end',
  },
  chartBar: {
    width: 60,
    height: '100%',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});