import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateQuestion from '../components/CreateQuestion';
import { Ionicons } from '@expo/vector-icons';
import { TriviaQuestion } from '../services/triviaService';
import { QuizHistory } from '../types/quiz';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState<QuizHistory | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const handleQuestionAccepted = (question: TriviaQuestion) => {
    const topic = question.category;
    if (!recentSearches.includes(topic)) {
      setRecentSearches(prev => [topic, ...prev].slice(0, 5));
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number, questions: TriviaQuestion[]) => {
    const newQuizHistory: QuizHistory = {
      topic: questions[0]?.category || 'General',
      timestamp: new Date().toISOString(),
      score,
      totalQuestions,
      difficulty: (questions[0]?.difficulty || 'medium') as 'easy' | 'medium' | 'hard',
      type: (questions[0]?.type || 'multiple') as 'multiple' | 'boolean'
    };

    setQuizHistory(prev => [newQuizHistory, ...prev].slice(0, 10));
    setLastQuizScore(newQuizHistory);
    setShowScoreModal(true);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderScoreModal = () => {
    if (!lastQuizScore) return null;

    const percentage = Math.round((lastQuizScore.score / lastQuizScore.totalQuestions) * 100);
    let message = '';
    let icon = '';

    if (percentage >= 80) {
      message = 'Outstanding Performance!';
      icon = 'trophy';
    } else if (percentage >= 60) {
      message = 'Great Job!';
      icon = 'star';
    } else {
      message = 'Keep Practicing!';
      icon = 'school';
    }

    return (
      <Modal
        visible={showScoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#8A2BE2', '#4B0082']}
              style={styles.modalHeader}
            >
              <Ionicons name={icon} size={60} color="#FFFFFF" style={styles.headerIcon} />
              <Text style={styles.modalTitle}>Quiz Complete!</Text>
            </LinearGradient>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.welcomeText}>Welcome Back, Quiz Master!</Text>
              <Text style={styles.scoreText}>Your Amazing Score</Text>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{lastQuizScore.score}</Text>
                <Text style={styles.scoreDivider}>/</Text>
                <Text style={styles.totalQuestions}>{lastQuizScore.totalQuestions}</Text>
              </View>
              <Text style={styles.percentageText}>{percentage}%</Text>
              <Text style={styles.messageText}>{message}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#8A2BE2" />
                  <Text style={styles.statText}>Correct: {lastQuizScore.score}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="close-circle" size={24} color="#8A2BE2" />
                  <Text style={styles.statText}>Incorrect: {lastQuizScore.totalQuestions - lastQuizScore.score}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScoreModal(false)}
            >
              <Text style={styles.closeButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#8A2BE2', '#4B0082']}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Quiz Generator</Text>
            <Text style={styles.headerSubtitle}>Test your knowledge!</Text>
          </LinearGradient>
        </View>

        <CreateQuestion
          onQuestionAccepted={handleQuestionAccepted}
          onQuizComplete={handleQuizComplete}
          onClose={() => {}}
        />

        {renderScoreModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    padding: 30,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scoreContainer: {
    padding: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  scoreDivider: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 10,
  },
  totalQuestions: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#666',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 15,
  },
  messageText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#8A2BE2',
    padding: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen; 