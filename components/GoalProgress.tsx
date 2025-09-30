import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  icon: string;
  deadline?: Date;
}

interface GoalProgressProps {
  goal: Goal;
  onGoalPress?: (goal: Goal) => void;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goal, onGoalPress }) => {
  const progress = goal.target > 0 ? goal.current / goal.target : 0;
  const percentage = Math.round(progress * 100);
  
  // Determine color based on progress
  let progressColor = '#4A90E2'; // Default blue
  if (progress >= 1) {
    progressColor = '#10B981'; // Green when completed
  } else if (progress >= 0.75) {
    progressColor = '#3B82F6'; // Light blue when nearly complete
  } else if (progress <= 0.25) {
    progressColor = '#EF4444'; // Red when just started
  }
  
  // Format deadline if it exists
  const formattedDeadline = goal.deadline 
    ? new Date(goal.deadline).toLocaleDateString('pt-BR')
    : null;
  
  // Calculate days remaining if deadline exists
  const daysRemaining = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name={goal.icon as any} size={24} color={progressColor} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.description}>{goal.description}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={progress} 
          color={progressColor} 
          style={styles.progressBar} 
        />
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{percentage}% complete</Text>
          <Text style={styles.statsText}>
            {goal.current} of {goal.target} {goal.unit}
          </Text>
        </View>
      </View>
      
      {formattedDeadline && (
        <View style={styles.deadlineContainer}>
          <MaterialCommunityIcons 
            name={daysRemaining && daysRemaining < 0 ? 'alert-circle' : 'calendar'} 
            size={16} 
            color={daysRemaining && daysRemaining < 0 ? '#EF4444' : '#6B7280'} 
          />
          <Text style={[
            styles.deadlineText,
            daysRemaining && daysRemaining < 0 ? styles.overdueText : undefined
          ]}>
            {daysRemaining && daysRemaining < 0 
              ? `${Math.abs(daysRemaining)} days overdue` 
              : daysRemaining && daysRemaining <= 7
                ? `${daysRemaining} days remaining`
                : `Due: ${formattedDeadline}`
            }
          </Text>
        </View>
      )}
      
      {progress >= 1 && (
        <View style={styles.celebrationContainer}>
          <MaterialCommunityIcons name="party-popper" size={20} color="#10B981" />
          <Text style={styles.celebrationText}>Goal achieved! 🎉</Text>
        </View>
      )}
    </View>
  );
};

interface GoalProgressListProps {
  goals: Goal[];
  onGoalPress?: (goal: Goal) => void;
}

export const GoalProgressList: React.FC<GoalProgressListProps> = ({ goals, onGoalPress }) => {
  if (goals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="target" size={48} color="#D1D5DB" />
        <Text style={styles.emptyText}>No goals yet</Text>
        <Text style={styles.emptySubtext}>Create your first goal to get started</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.listContainer}>
      {goals.map(goal => (
        <GoalProgress 
          key={goal.id} 
          goal={goal} 
          onGoalPress={onGoalPress} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deadlineText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  overdueText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  celebrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  celebrationText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});