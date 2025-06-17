# AI Quiz Generator

A React Native application that generates quiz questions using the Open Trivia Database API.

## Features

- Quiz question generation
- Cross-platform (iOS & Android)
- Multiple difficulty levels
- Various question types
- Local storage for quiz history

## Prerequisites

- Node.js (v14 or higher)
- React Native development environment
- Expo CLI

## Installation

1. Clone the repository:

git clone [repository-url]

2. Install dependencies:

npm install

3. Start the development server:
npm start

## Usage

1. **Generate Questions**
   - Tap "Generate" button
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
```

## API Integration

The app uses the Open Trivia Database API for question generation.

