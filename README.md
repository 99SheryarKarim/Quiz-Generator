# AI Quiz Generator

A React Native application that generates quiz questions using Google AI Studio's Gemini Pro model.

## Features

-  AI-powered quiz question generation
-  Cross-platform (iOS & Android)
-  Multiple difficulty levels
-  Various question types
-  Local storage for quiz history
-  Daily generation limit (10 questions)

## Prerequisites

- Node.js (v14 or higher)
- React Native development environment
- Google AI Studio API key
- Expo CLI

## Installation

1. Clone the repository:

git clone [repository-url]

2. Install dependencies:

npm install


3. Configure API key:
   - Create a `.env` file in the root directory
   - Add your Google AI Studio API key:

   GOOGLE_AI_API_KEY=your_api_key_here
   

4. Start the development server:
npm start


## Usage

1. **Generate Questions**
   - Tap "Generate with AI" button
   - Select topic, difficulty, and question type
   - Preview and insert generated questions

2. **Create Quiz**
   - Add generated questions to your quiz
   - Save and organize quizzes by topic

3. **Play Quiz**
   - Select a saved quiz
   - Answer questions and track progress

## Project Structure

```
src/
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # Main app screens
├── services/       # API and business logic


## API Integration

The app uses Google AI Studio's Gemini Pro model for question generation. API calls are limited to 10 per day to manage costs.

