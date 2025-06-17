import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { getTriviaQuestions, TriviaQuestion } from '../services/triviaService';
import { decodeHTML } from '../utils/stringUtils';
import { Ionicons } from '@expo/vector-icons';

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

  useEffect(() => {
    loadQuestions();
  }, []);

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
      setShowResults(true);
      onQuizComplete(score + (selectedAnswer === questions[currentQuestionIndex].correct_answer ? 1 : 0), questions.length, questions);
    }
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadQuestions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score} / {questions.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const answers = getAllAnswers();

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
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {decodeHTML(currentQuestion.question)}
        </Text>

        <View style={styles.answersContainer}>
          {answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerButton,
                selectedAnswer === answer && styles.selectedAnswer,
              ]}
              onPress={() => handleAnswerSelect(answer)}
            >
              <Text
                style={[
                  styles.answerText,
                  selectedAnswer === answer && styles.selectedAnswerText,
                ]}
              >
                {decodeHTML(answer)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedAnswer: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  answerText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedAnswerText: {
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
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
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizGame; 