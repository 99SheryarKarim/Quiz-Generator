import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.headerGradient}
          >
            <Text style={styles.title}>Thadda Quiz Generator</Text>
            <Text style={styles.subtitle}>Create engaging quizzes with AI</Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <CreateQuestion 
            onQuestionAccepted={handleQuestionAccepted}
            onQuizComplete={handleQuizComplete}
          />
        </View>

        {recentSearches.length > 0 && (
          <View style={styles.recentSearches}>
            <Text style={styles.sectionTitle}>Recent Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.topicChip}
                  onPress={() => handleQuestionAccepted({ category: topic } as TriviaQuestion)}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {quizHistory.length > 0 && (
          <View style={styles.quizHistory}>
            <Text style={styles.sectionTitle}>Recent Quizzes</Text>
            {quizHistory.map((quiz, index) => (
              <View key={index} style={styles.quizCard}>
                <View style={styles.quizHeader}>
                  <Text style={styles.quizTopic}>{quiz.topic}</Text>
                  <Text style={styles.quizDate}>
                    {new Date(quiz.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.quizDetails}>
                  <Text style={styles.quizScore}>
                    Score: {quiz.score}/{quiz.totalQuestions}
                  </Text>
                  <Text style={styles.quizPercentage}>
                    {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                  </Text>
                </View>
                <View style={styles.quizMeta}>
                  <Text style={styles.quizMetaText}>
                    {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)} • {quiz.type}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Ionicons name="bulb-outline" size={32} color="#007AFF" />
              <Text style={styles.featureTitle}>AI-Powered</Text>
              <Text style={styles.featureDescription}>
                Generate questions using advanced AI technology
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="options-outline" size={32} color="#007AFF" />
              <Text style={styles.featureTitle}>Customizable</Text>
              <Text style={styles.featureDescription}>
                Choose difficulty and question types
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="trophy-outline" size={32} color="#007AFF" />
              <Text style={styles.featureTitle}>Track Progress</Text>
              <Text style={styles.featureDescription}>
                Monitor your quiz performance
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="share-outline" size={32} color="#007AFF" />
              <Text style={styles.featureTitle}>Share</Text>
              <Text style={styles.featureDescription}>
                Share quizzes with friends
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerGradient: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  recentSearches: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  topicChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  topicText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  quizHistory: {
    padding: 20,
    paddingTop: 0,
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quizTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  quizDate: {
    fontSize: 12,
    color: '#666',
  },
  quizDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quizScore: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  quizPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizMetaText: {
    fontSize: 12,
    color: '#666',
  },
  featuresSection: {
    padding: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen; 