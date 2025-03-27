export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    score: number;
    level: "A" | "B" | "C" | "D"; // Or 1 | 2 | 3 | 4 if you prefer numbers
  }[];
}

export const TOPICS = [
  "Health",
  "Fitness",
  "Nutrition",
  "Mental Wellbeing",
] as const;

export const QUESTIONS: Record<string, Question[]> = {
  Health: [
    {
      id: 1,
      text: "How often do you exercise?",
      options: [
        { text: "Never", score: 1, level: "D" },
        { text: "1-2 times/week", score: 3, level: "C" },
        { text: "3-4 times/week", score: 5, level: "B" },
        { text: "Daily", score: 7, level: "A" },
      ],
    },
    {
      id: 2,
      text: "How would you rate your sleep quality?",
      options: [
        { text: "Poor", score: 1, level: "D" },
        { text: "Fair", score: 3, level: "C" },
        { text: "Good", score: 5, level: "B" },
        { text: "Excellent", score: 7, level: "A" },
      ],
    },
    // Add 6 more health questions...
  ],
  Fitness: [
    {
      id: 1,
      text: "How intense are your workouts?",
      options: [
        { text: "Light (walking, stretching)", score: 1, level: "D" },
        { text: "Moderate (jogging, cycling)", score: 3, level: "C" },
        { text: "Vigorous (running, HIIT)", score: 5, level: "B" },
        { text: "Very intense (competitive sports)", score: 7, level: "A" },
      ],
    },
    // Add 7 more fitness questions...
  ],
  Nutrition: [
    {
      id: 1,
      text: "How many servings of vegetables do you eat daily?",
      options: [
        { text: "0-1", score: 1, level: "D" },
        { text: "2-3", score: 3, level: "C" },
        { text: "4-5", score: 5, level: "B" },
        { text: "6+", score: 7, level: "A" },
      ],
    },
    // Add 7 more nutrition questions...
  ],
  MentalWellbeing: [
    {
      id: 1,
      text: "How often do you feel stressed?",
      options: [
        { text: "Constantly", score: 1, level: "D" },
        { text: "Frequently", score: 3, level: "C" },
        { text: "Occasionally", score: 5, level: "B" },
        { text: "Rarely", score: 7, level: "A" },
      ],
    },
    // Add 7 more mental wellbeing questions...
  ],
};
