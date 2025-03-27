import { Message, Question, QuestionOption } from "@/types/chat";
import DOMPurify from "isomorphic-dompurify";

// Helper functions
export const createBotMessage = (content: string): Message => ({
  content: DOMPurify.sanitize(content),
  isUser: false,
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});

export const formatQuestion = (
  question: Question,
  questionNumber: number,
  totalQuestions: number,
  topic: string
): string => {
  const sortedOptions = [...question.options].sort(
    (a: QuestionOption, b: QuestionOption) => b.score - a.score
  );

  return DOMPurify.sanitize(`
    <div class="bot-message">
      <p class="text-sm text-indigo-300 mb-1">${topic} Assessment</p>
      <p class="font-semibold">Question ${questionNumber}/${totalQuestions}:</p>
      <p class="my-2">${question.text}</p>
      <ul class="list-disc pl-5 space-y-1">
        ${sortedOptions
          .map(
            (opt: QuestionOption) =>
              `<li><strong>${opt.level}:</strong> ${opt.text}</li>`
          )
          .join("")}
      </ul>
      <p class="mt-2 text-sm text-gray-400">Reply with A, B, C, or D</p>
      <p class="mt-1 text-xs text-gray-500">Type 'exit' to cancel</p>
    </div>
  `);
};

export const calculateScore = (
  answers: Record<number, string>,
  questions: Question[]
): number => {
  if (!answers || Object.keys(answers).length === 0) return 0;

  return Object.entries(answers).reduce(
    (total: number, [index, answerLevel]) => {
      const question = questions[Number(index)];
      if (!question) return total;

      const selectedOption = question.options.find(
        (opt: QuestionOption) =>
          opt.level === (answerLevel.toUpperCase() as "A" | "B" | "C" | "D")
      );
      return total + (selectedOption?.score || 0);
    },
    0
  );
};

const generateAnswerSummary = (
  answers: Record<number, string>,
  questions: Question[]
): string => {
  return questions
    .map((q, i) => {
      const userAnswer = answers[i];
      const correctOption = q.options.reduce((max, opt) =>
        opt.score > max.score ? opt : max
      );
      const userOption = q.options.find(
        (opt) =>
          opt.level === (userAnswer?.toUpperCase() as "A" | "B" | "C" | "D")
      );

      return `
    <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p class="font-medium text-gray-800 mb-2">Q${i + 1}: ${q.text}</p>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-blue-50 p-2 rounded">
          <p class="text-blue-800 font-medium">Your Answer</p>
          <p>${userOption?.level || "N/A"}: ${
        userOption?.text || "Not answered"
      }</p>
          <p class="text-xs mt-1">Score: ${userOption?.score || 0}/${
        correctOption.score
      }</p>
        </div>
        <div class="bg-green-50 p-2 rounded">
          <p class="text-green-800 font-medium">Best Answer</p>
          <p class="text-gray-800">${correctOption.level}: ${
        correctOption.text
      }</p>
        </div>
      </div>
    </div>
    `;
    })
    .join("");
};

// Message templates
export const WELCOME_MESSAGE = createBotMessage(
  DOMPurify.sanitize(`
  <div class="bot-message">
    <h3 class="font-bold text-lg mb-2">👋 Welcome to Your Health Assessment!</h3>
    <p class="mb-2">Here's how this works:</p>
    <ol class="list-decimal pl-5 mb-4">
      <li>You'll provide your email</li>
      <li>Select a health topic</li>
      <li>Answer 8 questions (choose A/B/C/D)</li>
      <li>Receive your personalized health report</li>
    </ol>
    <p>Let's get started! Please enter your email:</p>
  </div>
`)
);

export const INVALID_EMAIL_MESSAGE = createBotMessage(
  DOMPurify.sanitize(`
  <div class="bot-message">
    <p>Please enter a valid email address to continue:</p>
  </div>
`)
);

export const getTopicSelectionMessage = (topics: string[]) =>
  createBotMessage(
    DOMPurify.sanitize(`
  <div class="bot-message">
    <p class="text-indigo-300">Health Assessment</p>
    <p>Thank you! Please select a health topic:</p>
    <ul class="list-disc pl-5 mt-2">
      ${topics.map((t) => `<li>${t}</li>`).join("")}
    </ul>
  </div>
`)
  );

export const INVALID_TOPIC_MESSAGE = (topics: string[]) =>
  createBotMessage(
    DOMPurify.sanitize(`
  <div class="bot-message">
    <p class="text-indigo-300">Health Assessment</p>
    <p>Please select one of these health topics:</p>
    <ul class="list-disc pl-5 mt-2">
      ${topics.map((t) => `<li>${t}</li>`).join("")}
    </ul>
  </div>
`)
  );

export const EXIT_MESSAGE = createBotMessage(
  DOMPurify.sanitize(`
  <div class="bot-message">
    <p>Assessment canceled. Type 'start' to begin again.</p>
    <p class="mt-2">Or ask me anything like:</p>
    <ul class="list-disc pl-5 mt-1">
      <li>What can you do?</li>
      <li>Tell me about yourself</li>
    </ul>
  </div>
`)
);

export const getInvalidAnswerMessage = (
  question: Question,
  questionNumber: number,
  totalQuestions: number,
  topic: string
) =>
  createBotMessage(
    DOMPurify.sanitize(`
  <div class="bot-message text-red-300">
    <p>Please respond with only A, B, C, or D</p>
    <p class="mt-2">Or type 'exit' to cancel assessment</p>
    ${formatQuestion(question, questionNumber, totalQuestions, topic)}
  </div>
`)
  );

export const getAssessmentResults = (
  score: number,
  maxScore: number,
  percentage: number,
  topic: string,
  answers: Record<number, string>,
  questions: Question[],
  email?: string
) => {
  // Calculate grade based on percentage
  const grade =
    percentage >= 90
      ? "A"
      : percentage >= 80
      ? "B"
      : percentage >= 70
      ? "C"
      : percentage >= 60
      ? "D"
      : "F";

  return createBotMessage(
    DOMPurify.sanitize(`
      <div id="assessment-results" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Header -->
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">📊 Health Assessment Report</h3>
          <p class="text-gray-600">${topic} Evaluation</p>
        </div>
  
        <!-- Score Summary -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-medium text-gray-700">Overall Score</span>
            <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">${grade}</span>
          </div>
          <p class="text-4xl font-bold text-indigo-600 text-center my-3">${percentage}%</p>
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>${score} points earned</span>
            <span>${maxScore} points possible</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
          </div>
        </div>
  
        <!-- User Details -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 p-3 rounded border border-gray-200">
            <p class="text-xs text-gray-500">Date</p>
            <p class="font-medium">${new Date().toLocaleDateString()}</p>
          </div>
          ${
            email
              ? `
          <div class="bg-gray-50 p-3 rounded border border-gray-200">
            <p class="text-xs text-gray-500">Email</p>
            <p class="font-medium truncate">${email}</p>
          </div>
          `
              : ""
          }
        </div>
  
        <!-- Answers Summary -->
        <h4 class="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Question Breakdown</h4>
        <div class="space-y-4">
          ${generateAnswerSummary(answers, questions)}
        </div>
  
        <!-- Footer -->
        <div class="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Report generated by Health Assessment Bot</p>
          <p class="mt-1">${new Date().toLocaleString()}</p>
        </div>
      </div>
    `)
  );
};
