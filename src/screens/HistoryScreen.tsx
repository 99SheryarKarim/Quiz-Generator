import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const HistoryScreen: React.FC = () => {
  const { isDark } = useTheme();

  const mockHistory = [
    {
      id: '1',
      date: '2024-03-20',
      topic: 'Science',
      score: 8,
      totalQuestions: 10,
    },
    {
      id: '2',
      date: '2024-03-19',
      topic: 'History',
      score: 7,
      totalQuestions: 10,
    },
    {
      id: '3',
      date: '2024-03-18',
      topic: 'Geography',
      score: 9,
      totalQuestions: 10,
    },
  ];

  const renderHistoryItem = (item: typeof mockHistory[0]) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.historyItem, isDark && styles.historyItemDark]}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.topic, isDark && styles.textDark]}>{item.topic}</Text>
        <Text style={[styles.date, isDark && styles.textDark]}>{item.date}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Ionicons 
          name="trophy" 
          size={24} 
          color={isDark ? '#1565C0' : '#2C3E50'} 
        />
        <Text style={[styles.score, isDark && styles.textDark]}>
          {item.score}/{item.totalQuestions}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Quiz History</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {mockHistory.map(renderHistoryItem)}
      </ScrollView>
    </View>
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
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyItemDark: {
    backgroundColor: '#2C2C2C',
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
    alignItems: 'center',
    gap: 10,
  },
  score: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default HistoryScreen; 