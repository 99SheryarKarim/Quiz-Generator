import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const { isDark } = useTheme();

  const history = [
    {
      id: '1',
      date: '2024-03-15',
      topic: 'Science',
      score: 8,
      totalQuestions: 10,
    },
    {
      id: '2',
      date: '2024-03-14',
      topic: 'History',
      score: 7,
      totalQuestions: 10,
    },
    {
      id: '3',
      date: '2024-03-13',
      topic: 'Geography',
      score: 9,
      totalQuestions: 10,
    },
  ];

  const renderHistoryItem = (item: typeof history[0]) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.historyItem, isDark && styles.historyItemDark]}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.topic, isDark && styles.textDark]}>{item.topic}</Text>
        <Text style={[styles.date, isDark && styles.textDark]}>{item.date}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, isDark && styles.textDark]}>
          Score: {item.score}/{item.totalQuestions}
        </Text>
        <Text style={[styles.percentage, isDark && styles.textDark]}>
          {Math.round((item.score / item.totalQuestions) * 100)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {history.map(renderHistoryItem)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyItemDark: {
    backgroundColor: '#2C2C2C',
    borderColor: '#333333',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topic: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  date: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    fontSize: 16,
    color: '#2C3E50',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default HistoryScreen; 