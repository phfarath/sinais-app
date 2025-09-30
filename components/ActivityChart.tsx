import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface ActivityData {
  day: string;
  activityCount: number;
  riskLevel: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  title?: string;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ 
  data, 
  title = 'Weekly Activity' 
}) => {
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        data: data.map(item => item.activityCount),
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4A90E2'
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

interface RiskChartProps {
  data: ActivityData[];
  title?: string;
}

export const RiskChart: React.FC<RiskChartProps> = ({ 
  data, 
  title = 'Risk Level Trend' 
}) => {
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        data: data.map(item => item.riskLevel),
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#EF4444'
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

interface ProgressData {
  name: string;
  progress: number;
  color: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  title = 'Goal Progress' 
}) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.progress * 100),
        color: (opacity = 1, index = 0) => data[index].color,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
});