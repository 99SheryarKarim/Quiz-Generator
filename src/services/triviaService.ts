import axios from 'axios';

export interface TriviaQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const BASE_URL = 'https://opentdb.com/api.php';
const CATEGORIES_URL = 'https://opentdb.com/api_category.php';

// Expanded topic mapping with more categories and aliases
const topicToCategoryMap: { [key: string]: number } = {
  // General Knowledge
  'general': 9,
  'general knowledge': 9,
  'trivia': 9,
  'random': 9,
  'fun facts': 9,

  // Books
  'books': 10,
  'literature': 10,
  'novels': 10,
  'authors': 10,
  'reading': 10,

  // Film
  'film': 11,
  'movies': 11,
  'cinema': 11,
  'actors': 11,
  'actresses': 11,
  'hollywood': 11,

  // Music
  'music': 12,
  'songs': 12,
  'artists': 12,
  'bands': 12,
  'singers': 12,
  'musicians': 12,

  // Science
  'science': 17,
  'scientific': 17,
  'physics': 17,
  'chemistry': 17,
  'biology': 17,
  'astronomy': 17,

  // Computers
  'computers': 18,
  'technology': 18,
  'programming': 18,
  'software': 18,
  'hardware': 18,
  'internet': 18,

  // Mathematics
  'mathematics': 19,
  'math': 19,
  'algebra': 19,
  'geometry': 19,
  'calculus': 19,
  'numbers': 19,

  // Sports
  'sports': 21,
  'games': 21,
  'football': 21,
  'basketball': 21,
  'soccer': 21,
  'tennis': 21,

  // Geography
  'geography': 22,
  'countries': 22,
  'cities': 22,
  'capitals': 22,
  'maps': 22,
  'continents': 22,

  // History
  'history': 23,
  'historical': 23,
  'ancient': 23,
  'world war': 23,
  'civilization': 23,
  'historical events': 23,

  // Politics
  'politics': 24,
  'government': 24,
  'political': 24,
  'elections': 24,
  'leaders': 24,

  // Art
  'art': 25,
  'painting': 25,
  'sculpture': 25,
  'artists': 25,
  'museum': 25,

  // Celebrities
  'celebrities': 26,
  'famous people': 26,
  'stars': 26,
  'personalities': 26,

  // Animals
  'animals': 27,
  'wildlife': 27,
  'pets': 27,
  'mammals': 27,
  'birds': 27,

  // Vehicles
  'vehicles': 28,
  'cars': 28,
  'automobiles': 28,
  'transportation': 28,
  'planes': 28,
  'ships': 28,

  // Entertainment
  'entertainment': 29,
  'tv': 29,
  'television': 29,
  'shows': 29,
  'series': 29,

  // Gadgets
  'gadgets': 30,
  'electronics': 30,
  'devices': 30,
  'smartphones': 30,
  'computers': 30,

  // Japanese Anime & Manga
  'anime': 31,
  'manga': 31,
  'japanese animation': 31,
  'cartoons': 31,

  // Cartoon & Animations
  'cartoons': 32,
  'animation': 32,
  'animated': 32,
  'disney': 32,
  'pixar': 32
};

class TriviaService {
  private findClosestCategory(topic: string): number {
    // Convert topic to lowercase for case-insensitive matching
    const normalizedTopic = topic.toLowerCase().trim();
    
    // Direct match
    if (topicToCategoryMap[normalizedTopic]) {
      return topicToCategoryMap[normalizedTopic];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(topicToCategoryMap)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return value;
      }
    }

    // If no match found, return general knowledge as default
    return 9;
  }

  async getQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', amount: number = 10): Promise<TriviaQuestion[]> {
    try {
      const categoryId = this.findClosestCategory(topic);
      console.log(`Mapping topic "${topic}" to category ID: ${categoryId}`);

      const response = await axios.get(BASE_URL, {
        params: {
          amount,
          category: categoryId,
          difficulty,
          type: 'multiple'
        }
      });

      if (response.data.response_code === 0) {
        const questions = response.data.results;
        console.log('Sample question:', JSON.stringify(questions[0]));
        return questions;
      } else {
        throw new Error('No questions found for the selected criteria');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(CATEGORIES_URL);
      return response.data.trivia_categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const triviaService = new TriviaService(); 