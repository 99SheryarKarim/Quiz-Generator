import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { getTriviaQuestions, TriviaQuestion } from '../services/triviaService';
import { decodeHTML } from '../utils/stringUtils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface QuizGameProps {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: 'multiple' | 'boolean';
  onQuizComplete: (score: number, totalQuestions: number, questions: TriviaQuestion[]) => void;
  onClose: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({
  topic,
  difficulty,
  questionType,
  onQuizComplete,
  onClose,
}) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (showScoreModal) {
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
      setShowConfetti(true);
    }
  }, [showScoreModal]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTriviaQuestions(10, undefined, difficulty, questionType);
      
      if (response.results.length === 0) {
        setError('No questions found for the selected criteria');
        return;
      }

      setQuestions(response.results);
    } catch (error) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowScoreModal(true);
      onQuizComplete(score, questions.length, questions);
    }
  };

  const handleClose = () => {
    setShowScoreModal(false);
    onClose();
  };

  const renderScoreModal = () => {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let color = '';
    let icon = '';
    let gradientColors = ['#4A90E2', '#357ABD'];

    if (percentage >= 80) {
      message = 'Outstanding!';
      color = '#34C759';
      icon = 'trophy';
      gradientColors = ['#34C759', '#2FB350'];
    } else if (percentage >= 60) {
      message = 'Great Job!';
      color = '#FF9500';
      icon = 'star';
      gradientColors = ['#FF9500', '#FF8000'];
    } else {
      message = 'Keep Practicing!';
      color = '#FF3B30';
      icon = 'school';
      gradientColors = ['#FF3B30', '#FF2D20'];
    }

    return (
      <Modal
        visible={showScoreModal}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
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
              colors={gradientColors}
              style={styles.modalHeader}
            >
              <Ionicons name={icon} size={40} color="#FFFFFF" style={styles.headerIcon} />
              <Text style={styles.modalTitle}>Quiz Complete!</Text>
            </LinearGradient>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Your Score</Text>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreValue, { color }]}>{score}</Text>
                <Text style={styles.scoreDivider}>/</Text>
                <Text style={styles.totalQuestions}>{questions.length}</Text>
              </View>
              <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
              <Text style={[styles.messageText, { color }]}>{message}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                  <Text style={styles.statText}>Correct: {score}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  <Text style={styles.statText}>Incorrect: {questions.length - score}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: color }]}
              onPress={handleClose}
            >
              <Text style={styles.closeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  const getAllAnswers = () => {
    const question = getCurrentQuestion();
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5); // Shuffle answers
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadQuestions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadQuestions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {decodeHTML(questions[currentQuestionIndex].question)}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {getAllAnswers().map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === answer && styles.selectedOption
            ]}
            onPress={() => handleAnswerSelect(answer)}
            disabled={selectedAnswer !== null}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === answer && styles.selectedOptionText
            ]}>
              {decodeHTML(answer)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedAnswer && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Text>
        </TouchableOpacity>
      )}

      {renderScoreModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  questionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 28,
  },
  optionsContainer: {
    padding: 20,
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedOptionText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  messageText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
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
    padding: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QuizGame; 