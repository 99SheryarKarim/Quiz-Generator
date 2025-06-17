import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface QuizHistory {
  topic: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  difficulty: string;
  type: string;
}

const HistoryScreen: React.FC = () => {
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([
    // Sample data for testing
    {
      topic: 'Science',
      timestamp: '2024-03-20T10:30:00',
      score: 8,
      totalQuestions: 10,
      difficulty: 'Medium',
      type: 'Multiple Choice',
    },
    {
      topic: 'History',
      timestamp: '2024-03-19T15:45:00',
      score: 7,
      totalQuestions: 10,
      difficulty: 'Hard',
      type: 'True/False',
    },
  ]);

  const handleDeleteHistory = (index: number) => {
    Alert.alert(
      'Delete Quiz History',
      'Are you sure you want to delete this quiz history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setQuizHistory(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const handleClearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all quiz history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setQuizHistory([]);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz History</Text>
        {quizHistory.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAllHistory}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      {quizHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#666" />
          <Text style={styles.emptyStateText}>No quiz history yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Complete some quizzes to see your history here
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {quizHistory.map((quiz, index) => (
            <View key={index} style={styles.quizCard}>
              <View style={styles.quizHeader}>
                <View style={styles.topicContainer}>
                  <Ionicons name="book-outline" size={20} color="#666" />
                  <Text style={styles.topic}>{quiz.topic}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHistory(index)}
                >
                  <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>

              <View style={styles.quizDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="trophy-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {quiz.score}/{quiz.totalQuestions}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="speedometer-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{quiz.difficulty}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="help-circle-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{quiz.type}</Text>
                  </View>
                </View>

                <View style={styles.scoreContainer}>
                  <View
                    style={[
                      styles.scoreBar,
                      {
                        width: `${(quiz.score / quiz.totalQuestions) * 100}%`,
                        backgroundColor: getScoreColor(quiz.score, quiz.totalQuestions),
                      },
                    ]}
                  />
                </View>

                <Text style={styles.timestamp}>{formatDate(quiz.timestamp)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  clearButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topic: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
  quizDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
  scoreContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HistoryScreen; 