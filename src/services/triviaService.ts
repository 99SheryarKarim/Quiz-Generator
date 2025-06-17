import axios from 'axios';

const BASE_URL = 'https://opentdb.com/api.php';
const CATEGORIES_URL = 'https://opentdb.com/api_category.php';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

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
      const response = await axios.get(params ? `${url}?${params.toString()}` : url);
      return response.data;
    } catch (error) {
      lastError = error as Error;
      
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        // Calculate delay with exponential backoff
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        console.log(`Rate limited. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Max retries reached');
}

export const getTriviaQuestions = async (
  amount: number = 10,
  category?: number,
  difficulty?: 'easy' | 'medium' | 'hard',
  type?: 'multiple' | 'boolean'
): Promise<TriviaResponse> => {
  try {
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
    
    return response;
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    throw error;
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
    throw error;
  }
};

// Clear categories cache (useful for testing or when you need fresh data)
export const clearCategoriesCache = () => {
  categoriesCache = null;
}; 