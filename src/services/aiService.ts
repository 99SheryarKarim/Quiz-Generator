import axios from 'axios';

const BASE_URL = 'https://opentdb.com/api.php';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

interface TriviaResponse {
  response_code: number;
  results: Array<{
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }>;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle retries with exponential backoff
async function fetchWithRetry(url: string, params: URLSearchParams, retryCount = 0): Promise<TriviaResponse> {
  try {
    const response = await axios.get<TriviaResponse>(`${url}?${params.toString()}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      // Calculate delay with exponential backoff
      const delayMs = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Attempt ${retryCount + 1} failed. Retrying in ${delayMs}ms...`);
      await delay(delayMs);
      return fetchWithRetry(url, params, retryCount + 1);
    }
    throw error;
  }
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

      const response = await fetchWithRetry(BASE_URL, params);
      
      if (response.response_code !== 0 || !response.results?.[0]) {
        throw new Error('No results found for the selected criteria');
      }

      const question = response.results[0];
      
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
      
      // Provide more specific error messages
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        if (error.response) {
          throw new Error(`Server error: ${error.response.status}. Please try again later.`);
        }
      }
      
      throw new Error('Failed to generate question. Please try again.');
    }
  }
}; 