import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateQuestion from '../components/CreateQuestion';
import { Ionicons } from '@expo/vector-icons';
import { TriviaQuestion } from '../services/triviaService';
import { QuizHistory } from '../types/quiz';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState<QuizHistory | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));
  const [rotateAnim] = useState(new Animated.Value(0));

  // Feature cards animation
  const [featureCardsAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate feature cards on mount
    Animated.timing(featureCardsAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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

    // Enhanced animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderFeatureCard = (icon: string, title: string, description: string, index: number) => {
    const translateY = featureCardsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });

    const opacity = featureCardsAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1]
    });

    return (
      <Animated.View
        style={[
          styles.featureCard,
          isDark && styles.featureCardDark,
          {
            transform: [{ translateY }],
            opacity,
          }
        ]}
      >
        <View style={styles.featureContent}>
          <View style={[styles.featureIconContainer, isDark && styles.featureIconContainerDark]}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>{title}</Text>
            <Text style={[styles.featureDescription, isDark && styles.featureDescriptionDark]}>{description}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderScoreModal = () => {
    if (!lastQuizScore) return null;

    const percentage = Math.round((lastQuizScore.score / lastQuizScore.totalQuestions) * 100);
    let message = '';
    let icon = '';
    let gradientColors = ['#2C3E50', '#34495E'];

    if (percentage >= 80) {
      message = 'Outstanding Performance!';
      icon = 'trophy';
      gradientColors = ['#2980B9', '#3498DB'];
    } else if (percentage >= 60) {
      message = 'Great Job!';
      icon = 'star';
      gradientColors = ['#16A085', '#1ABC9C'];
    } else {
      message = 'Keep Practicing!';
      icon = 'school';
      gradientColors = ['#2C3E50', '#34495E'];
    }

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

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
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                  { rotate }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={gradientColors}
              style={styles.modalHeader}
            >
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Ionicons name={icon} size={60} color="#FFFFFF" style={styles.headerIcon} />
              </Animated.View>
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
                  <Ionicons name="checkmark-circle" size={24} color="#2980B9" />
                  <Text style={styles.statText}>Correct: {lastQuizScore.score}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="close-circle" size={24} color="#2980B9" />
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
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#0D47A1', '#1565C0']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Ionicons name="school" size={32} color="#FFFFFF" style={styles.headerIcon} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Thadda Quiz Generator</Text>
                <Text style={styles.headerSubtitle}>Test your knowledge!</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.featuresGrid}>
          {renderFeatureCard('time', '24/7 Support', 'Get help anytime, anywhere', 0)}
          {renderFeatureCard('people', 'Live Quizzes', 'Compete with players worldwide', 1)}
          {renderFeatureCard('trophy', 'Daily Challenges', 'New questions every day', 2)}
          {renderFeatureCard('stats-chart', 'Progress Tracking', 'Monitor your improvement', 3)}
          {renderFeatureCard('globe', 'Global Rankings', 'Compete on the leaderboard', 4)}
          {renderFeatureCard('gift', 'Rewards', 'Earn points and unlock achievements', 5)}
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
    backgroundColor: '#F8F9FA',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: width / 2 - 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  featureCardDark: {
    backgroundColor: '#2C2C2C',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconContainerDark: {
    backgroundColor: '#1565C0',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  featureTitleDark: {
    color: '#FFFFFF',
  },
  featureDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 16,
  },
  featureDescriptionDark: {
    color: '#B0BEC5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    padding: 35,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scoreContainer: {
    padding: 35,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  scoreDivider: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginHorizontal: 10,
  },
  totalQuestions: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2980B9',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 35,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
    paddingTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#BDC3C7',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  closeButton: {
    backgroundColor: '#2C3E50',
    padding: 22,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen; 