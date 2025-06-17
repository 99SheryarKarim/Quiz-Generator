export interface QuizHistory {
  topic: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple' | 'boolean';
} 