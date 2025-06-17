"use client"

import React from 'react'
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from "react-native"
import type { TriviaQuestion } from "../services/triviaService"
import QuizGame from "./QuizGame"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"
import { aiService } from "../services/aiService"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from '../context/ThemeContext'

interface CreateQuestionProps {
  onQuestionAccepted: (question: TriviaQuestion) => void
  onQuizComplete: (score: number, totalQuestions: number, questions: TriviaQuestion[]) => void
  onClose: () => void
}

type Difficulty = "easy" | "medium" | "hard"
type QuestionType = "multiple" | "boolean"

const CreateQuestion: React.FC<CreateQuestionProps> = ({ onQuestionAccepted, onQuizComplete, onClose }) => {
  const { isDark } = useTheme()
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [type, setType] = useState<QuestionType>("multiple")
  const [question, setQuestion] = useState<TriviaQuestion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)

  const handleGenerateQuestion = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await aiService.generateQuestion(topic, difficulty, type)
      console.log("Generated question:", response)

      // Transform the response to match TriviaQuestion format
      const triviaQuestion: TriviaQuestion = {
        category: response.category,
        type: response.type,
        difficulty: response.difficulty,
        question: response.question,
        correct_answer: response.correct_answer,
        incorrect_answers: response.incorrect_answers
      }

      setQuestion(triviaQuestion)
    } catch (err) {
      console.error("Error generating question:", err)
      setError(err instanceof Error ? err.message : "Failed to generate question")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuestion = () => {
    if (question) {
      onQuestionAccepted(question)
    }
  }

  const handleStartQuiz = () => {
    if (question) {
      setShowQuiz(true)
    }
  }

  // Render the quiz if showQuiz is true
  if (showQuiz && question) {
    return (
      <QuizGame
        topic={topic || question.category}
        difficulty={difficulty}
        questionType={type}
        onQuizComplete={(score: number, totalQuestions: number, questions: TriviaQuestion[]) => {
          setShowQuiz(false)
          onQuizComplete?.(score, totalQuestions, questions)
        }}
        onClose={() => setShowQuiz(false)}
      />
    )
  }

  // Main render
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Topic</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={topic}
              onChangeText={(text) => {
                setTopic(text)
                setError(null)
              }}
              placeholder="Enter topic (e.g., History, Science)"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Difficulty</Text>
            <View style={[styles.pickerContainer, isDark && styles.pickerContainerDark]}>
              <Picker
                selectedValue={difficulty}
                onValueChange={(value) => setDifficulty(value as Difficulty)}
                style={[styles.picker, isDark && styles.pickerDark]}
                dropdownIconColor={isDark ? '#FFFFFF' : '#2C3E50'}
              >
                <Picker.Item label="Easy" value="easy" color={isDark ? '#FFFFFF' : '#2C3E50'} />
                <Picker.Item label="Medium" value="medium" color={isDark ? '#FFFFFF' : '#2C3E50'} />
                <Picker.Item label="Hard" value="hard" color={isDark ? '#FFFFFF' : '#2C3E50'} />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Question Type</Text>
            <View style={[styles.pickerContainer, isDark && styles.pickerContainerDark]}>
              <Picker
                selectedValue={type}
                onValueChange={(value) => setType(value as QuestionType)}
                style={[styles.picker, isDark && styles.pickerDark]}
                dropdownIconColor={isDark ? '#FFFFFF' : '#2C3E50'}
              >
                <Picker.Item label="Multiple Choice" value="multiple" color={isDark ? '#FFFFFF' : '#2C3E50'} />
                <Picker.Item label="True/False" value="boolean" color={isDark ? '#FFFFFF' : '#2C3E50'} />
              </Picker>
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleGenerateQuestion}
            disabled={loading}
          >
            <LinearGradient colors={["#4A90E2", "#357ABD"]} style={styles.generateButtonGradient}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="create-outline" size={24} color="#FFFFFF" style={styles.generateButtonIcon} />
                  <Text style={styles.generateButtonText}>Generate Question</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {question && (
            <View style={[styles.questionContainer, isDark && styles.questionContainerDark]}>
              <Text style={[styles.questionText, isDark && styles.textDark]}>{question.question}</Text>
              <View style={styles.optionsContainer}>
                {[...question.incorrect_answers, question.correct_answer]
                  .sort(() => Math.random() - 0.5)
                  .map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.optionButton, isDark && styles.optionButtonDark]}
                      onPress={() => {
                        console.log("Selected option:", option)
                      }}
                    >
                      <Text style={[styles.optionText, isDark && styles.textDark]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.generateButton]} onPress={handleGenerateQuestion}>
                  <Text style={styles.buttonText}>Generate New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAcceptQuestion}>
                  <Text style={styles.buttonText}>Accept Question</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.quizButton]} onPress={handleStartQuiz}>
                  <Text style={styles.buttonText}>Start Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  containerDark: {
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  textDark: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },
  inputDark: {
    borderColor: "#333333",
    color: "#FFFFFF",
    backgroundColor: "#2C2C2C",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  pickerContainerDark: {
    borderColor: "#333333",
    backgroundColor: "#2C2C2C",
  },
  picker: {
    height: 50,
    color: "#1A1A1A",
  },
  pickerDark: {
    color: "#FFFFFF",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
  },
  generateButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#4A90E2",
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  generateButtonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  questionContainer: {
    padding: 20,
    gap: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginTop: 20,
  },
  questionContainerDark: {
    backgroundColor: "#2C2C2C",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1A1A1A",
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
  },
  optionButtonDark: {
    backgroundColor: "#2C2C2C",
    borderColor: "#333333",
  },
  optionText: {
    fontSize: 16,
    color: "#666666",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  button: {
    flex: 1,
    minWidth: "30%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#FF9500",
  },
  quizButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default CreateQuestion
