import axios from 'axios';

const BASE_URL = 'https://opentdb.com/api.php';

export interface AIResponse {
  question: string;
  answer: string;
  wrong_options: string[];
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export const aiService = {
  async generateQuestion(topic: string, difficulty: string, type: string): Promise<AIResponse> {
    try {
      const params = new URLSearchParams({
        amount: '1',
        difficulty,
        type,
        encode: 'url3986'
      });

      const response = await axios.get(`${BASE_URL}?${params.toString()}`);
      
      if (response.data.response_code !== 0 || !response.data.results?.[0]) {
        throw new Error('No results found for the selected criteria');
      }

      const question = response.data.results[0];
      
      // Decode HTML entities
      const decodedQuestion = decodeURIComponent(question.question);
      const decodedCorrectAnswer = decodeURIComponent(question.correct_answer);
      const decodedIncorrectAnswers = question.incorrect_answers.map((answer: string) => 
        decodeURIComponent(answer)
      );

      // Transform to match the expected format
      return {
        question: decodedQuestion,
        answer: decodedCorrectAnswer,
        wrong_options: decodedIncorrectAnswers,
        category: question.category,
        type: question.type,
        difficulty: question.difficulty,
        correct_answer: decodedCorrectAnswer,
        incorrect_answers: decodedIncorrectAnswers
      };
    } catch (error) {
      console.error('Error in generateQuestion:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate question: ${error.message}`);
      }
      throw new Error('Failed to generate question. Please try again.');
    }
  }
}; 