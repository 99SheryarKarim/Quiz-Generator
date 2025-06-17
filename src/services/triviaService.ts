import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://opentdb.com/api.php';
const CATEGORIES_URL = 'https://opentdb.com/api_category.php';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const DAILY_GENERATION_LIMIT = 50; // Increased limit to allow for multiple quizzes
const GENERATION_COUNT_KEY = 'daily_generation_count';
const LAST_GENERATION_DATE_KEY = 'last_generation_date';

export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  trivia_categories: Category[];
}

// Cache for categories to avoid repeated API calls
let categoriesCache: Category[] | null = null;

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle retries with exponential backoff
async function fetchWithRetry<T>(url: string, params?: URLSearchParams): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get<T>(params ? `${url}?${params.toString()}` : url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      lastError = error as Error;
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.log(`Attempt ${attempt + 1} timed out. Retrying...`);
        } else if (error.code === 'ERR_NETWORK') {
          console.log(`Attempt ${attempt + 1} failed due to network error. Retrying...`);
        } else if (error.response?.status === 429) {
          console.log(`Rate limited. Retrying in ${RETRY_DELAY * Math.pow(2, attempt)}ms...`);
        }
      }
      
      if (attempt < MAX_RETRIES - 1) {
        const delayMs = RETRY_DELAY * Math.pow(2, attempt);
        await delay(delayMs);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Max retries reached');
}

// Helper function to check and update daily generation limit
async function checkDailyGenerationLimit(amount: number): Promise<boolean> {
  try {
    const today = new Date().toDateString();
    const lastGenerationDate = await AsyncStorage.getItem(LAST_GENERATION_DATE_KEY);
    const generationCount = await AsyncStorage.getItem(GENERATION_COUNT_KEY);

    // Reset count if it's a new day
    if (lastGenerationDate !== today) {
      await AsyncStorage.setItem(LAST_GENERATION_DATE_KEY, today);
      await AsyncStorage.setItem(GENERATION_COUNT_KEY, '0');
      return true;
    }

    // Check if limit reached
    const count = parseInt(generationCount || '0');
    if (count + amount > DAILY_GENERATION_LIMIT) {
      throw new Error(`Daily generation limit of ${DAILY_GENERATION_LIMIT} questions reached. You can generate ${DAILY_GENERATION_LIMIT - count} more questions today.`);
    }

    // Increment count
    await AsyncStorage.setItem(GENERATION_COUNT_KEY, (count + amount).toString());
    return true;
  } catch (error) {
    console.error('Error checking generation limit:', error);
    throw error; // Propagate the error to show the specific message
  }
}

// Helper function to log question generation
async function logQuestionGeneration(question: TriviaQuestion) {
  try {
    const logs = await AsyncStorage.getItem('question_logs');
    const questionLogs = logs ? JSON.parse(logs) : [];
    questionLogs.push({
      question,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('question_logs', JSON.stringify(questionLogs));
  } catch (error) {
    console.error('Error logging question:', error);
  }
}

export const getTriviaQuestions = async (
  amount: number = 10,
  category?: number,
  difficulty?: 'easy' | 'medium' | 'hard',
  type?: 'multiple' | 'boolean'
): Promise<TriviaResponse> => {
  try {
    // Check daily generation limit
    await checkDailyGenerationLimit(amount);

    const params = new URLSearchParams({
      amount: amount.toString(),
      ...(category && { category: category.toString() }),
      ...(difficulty && { difficulty }),
      ...(type && { type }),
    });

    const response = await fetchWithRetry<TriviaResponse>(BASE_URL, params);
    
    if (response.response_code !== 0) {
      throw new Error('No results found for the selected criteria');
    }

    // Log the generated questions
    for (const question of response.results) {
      await logQuestionGeneration(question);
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    if (error instanceof Error) {
      throw error; // Propagate the specific error message
    }
    throw new Error('Failed to fetch questions. Please try again.');
  }
};

export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    // Return cached categories if available
    if (categoriesCache) {
      return { trivia_categories: categoriesCache };
    }

    const response = await fetchWithRetry<CategoriesResponse>(CATEGORIES_URL);
    categoriesCache = response.trivia_categories;
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    throw new Error('Failed to fetch categories. Please try again.');
  }
};

// Clear categories cache (useful for testing or when you need fresh data)
export const clearCategoriesCache = () => {
  categoriesCache = null;
}; 