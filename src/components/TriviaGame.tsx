import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getTriviaQuestions, TriviaQuestion } from '../services/triviaService';

export const TriviaGame: React.FC = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await getTriviaQuestions(10);
      setQuestions(response.results);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No questions available</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
    .sort(() => Math.random() - 0.5);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.questionNumber}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      
      <View style={styles.answersContainer}>
        {allAnswers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              selectedAnswer === answer && styles.selectedAnswer,
              selectedAnswer && answer === currentQuestion.correct_answer && styles.correctAnswer,
            ]}
            onPress={() => handleAnswer(answer)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answersContainer: {
    gap: 10,
  },
  answerButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedAnswer: {
    backgroundColor: '#ddd',
  },
  correctAnswer: {
    backgroundColor: '#90EE90',
  },
  answerText: {
    fontSize: 16,
  },
}); 