import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BettingMonitor, BettingEvent } from '../services/BettingMonitorService';

// Instância do serviço para obter dados de aposta
const bettingMonitor = new BettingMonitor();

// Simula o retorno de uma carteira de investimentos conservadora
const calculateInvestmentReturn = (events: BettingEvent[]): number => {
  const annualRate = 0.10; // Retorno anual de 10%
  const today = new Date();

  const potentialValue = events.reduce((total, event) => {
    const principal = event.amount;
    const eventDate = new Date(event.timestamp);
    
    const years = (today.getTime() - eventDate.getTime()) / (1000 * 365.25 * 24 * 60 * 60);

    if (years > 0) {
      // Juros compostos: A = P(1 + r)^t
      const futureValue = principal * Math.pow((1 + annualRate), years);
      return total + futureValue;
    }
    
    return total + principal;
  }, 0);

  return potentialValue;
};


export default function InvestmentComparisonScreen() {
  const [totalSpent, setTotalSpent] = useState(0);
  const [investmentValue, setInvestmentValue] = useState(0);

  useEffect(() => {
    // Gera dados de exemplo para a demonstração
    bettingMonitor.generateSampleData();

    const events = bettingMonitor.getAllEvents();
    const spent = bettingMonitor.getTotalAmountSpent();
    const potentialReturn = calculateInvestmentReturn(events);

    setTotalSpent(spent);
    setInvestmentValue(potentialReturn);
  }, []);

  const profit = investmentValue - totalSpent;
  const profitPercentage = totalSpent > 0 ? (profit / totalSpent) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Apostas vs. Investimentos</Text>
        <Text style={styles.subtitle}>
          Veja o que seu dinheiro gasto em apostas poderia ter rendido em uma carteira de investimentos.
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={[styles.card, styles.bettingCard]}>
          <MaterialCommunityIcons name="cards-playing-outline" size={40} color="#D9534F" />
          <Text style={styles.cardTitle}>Total Gasto em Apostas</Text>
          <Text style={styles.cardValue}>
            R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.cardDescription}>Valor total de todas as suas apostas registradas.</Text>
        </View>

        <View style={[styles.card, styles.investmentCard]}>
          <MaterialCommunityIcons name="chart-line" size={40} color="#5CB85C" />
          <Text style={styles.cardTitle}>Valor Potencial Investido</Text>
          <Text style={styles.cardValue}>
            R$ {investmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.cardDescription}>Simulação com retorno anual de 10%.</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <MaterialCommunityIcons name="information-outline" size={24} color="#4A90E2" />
        <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryTitle}>Resumo da Oportunidade</Text>
            <Text style={styles.summaryText}>
                Seu dinheiro poderia ter rendido{' '}
                <Text style={styles.highlightGreen}>
                    R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                {' '} a mais, um ganho de{' '}
                <Text style={styles.highlightGreen}>
                    {profitPercentage.toFixed(1)}%
                </Text>.
            </Text>
            <Text style={styles.disclaimer}>
                *Este é um cálculo simulado e não representa uma garantia de retorno.
            </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 180,
  },
  bettingCard: {
    borderColor: '#D9534F',
    borderWidth: 1,
  },
  investmentCard: {
    borderColor: '#5CB85C',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 8,
  },
  cardDescription: {
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  highlightGreen: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  disclaimer: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 12,
      fontStyle: 'italic',
  }
});