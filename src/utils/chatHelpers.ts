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

// export const getAssessmentResults = (
//   score: number,
//   maxScore: number,
//   percentage: number,
//   topic: string,
//   answers: Record<number, string>,
//   questions: Question[],
//   email?: string
// ) => {
//   // Calculate grade based on percentage
//   const grade =
//     percentage >= 90
//       ? "A"
//       : percentage >= 80
//       ? "B"
//       : percentage >= 70
//       ? "C"
//       : percentage >= 60
//       ? "D"
//       : "F";

//   return createBotMessage(
//     DOMPurify.sanitize(`
//       <div id="assessment-results" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <!-- Header -->
//         <div class="text-center mb-6">
//           <h3 class="text-2xl font-bold text-gray-800 mb-2">📊 Health Assessment Report</h3>
//           <p class="text-gray-600">${topic} Evaluation</p>
//         </div>

//         <!-- Score Summary -->
//         <div class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
//           <div class="flex justify-between items-center mb-2">
//             <span class="text-lg font-medium text-gray-700">Overall Score</span>
//             <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">${grade}</span>
//           </div>
//           <p class="text-4xl font-bold text-indigo-600 text-center my-3">${percentage}%</p>
//           <div class="flex justify-between text-sm text-gray-600 mb-2">
//             <span>${score} points earned</span>
//             <span>${maxScore} points possible</span>
//           </div>
//           <div class="w-full bg-gray-200 rounded-full h-2.5">
//             <div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
//           </div>
//         </div>

//         <!-- User Details -->
//         <div class="grid grid-cols-2 gap-4 mb-6">
//           <div class="bg-gray-50 p-3 rounded border border-gray-200">
//             <p class="text-xs text-gray-500">Date</p>
//             <p class="font-medium">${new Date().toLocaleDateString()}</p>
//           </div>
//           ${
//             email
//               ? `
//           <div class="bg-gray-50 p-3 rounded border border-gray-200">
//             <p class="text-xs text-gray-500">Email</p>
//             <p class="font-medium truncate">${email}</p>
//           </div>
//           `
//               : ""
//           }
//         </div>

//         <!-- Answers Summary -->
//         <h4 class="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Question Breakdown</h4>
//         <div class="space-y-4">
//           ${generateAnswerSummary(answers, questions)}
//         </div>

//         <!-- Footer -->
//         <div class="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
//           <p>Report generated by Health Assessment Bot</p>
//           <p class="mt-1">${new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     `)
//   );
// };

// export const getAssessmentResults = (
//   score: number,
//   maxScore: number,
//   percentage: number,
//   topic: string,
//   answers: Record<number, string>,
//   questions: Question[],
//   email?: string
// ) => {
//   const grade =
//     percentage >= 90
//       ? "A"
//       : percentage >= 80
//       ? "B"
//       : percentage >= 70
//       ? "C"
//       : percentage >= 60
//       ? "D"
//       : "F";

//   const gradeColor = {
//     A: "bg-emerald-100 text-emerald-800",
//     B: "bg-teal-100 text-teal-800",
//     C: "bg-amber-100 text-amber-800",
//     D: "bg-orange-100 text-orange-800",
//     F: "bg-red-100 text-red-800",
//   }[grade];

//   return createBotMessage(
//     DOMPurify.sanitize(`
//     <div id="assessment-results" class="text-gray-800 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
//       <!-- Header -->
//       <div class="text-center mb-6">
//         <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
//           <span class="text-2xl">📋</span>
//         </div>
//         <h3 class="text-2xl font-bold text-gray-800 mb-1">Assessment Report</h3>
//         <p class="text-indigo-600 font-medium">${topic}</p>
//       </div>

//       <!-- Score Card -->
//       <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-xs mb-6">
//         <div class="flex items-center justify-between mb-4">
//           <div>
//             <p class="text-sm text-gray-500">Your Score</p>
//             <p class="text-3xl font-bold text-gray-800 mt-1">${score}<span class="text-gray-400 text-lg">/${maxScore}</span></p>
//           </div>
//           <div class="flex flex-col items-end">
//             <span class="text-sm text-gray-500">Grade</span>
//             <span class="px-3 py-1 ${gradeColor} rounded-full text-sm font-bold mt-1">${grade}</span>
//           </div>
//         </div>

//         <!-- Progress Bar -->
//         <div class="mb-3">
//           <div class="flex justify-between text-sm text-gray-600 mb-1">
//             <span>Completion</span>
//             <span>${percentage}%</span>
//           </div>
//           <div class="w-full bg-gray-200 rounded-full h-2">
//             <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
//                  style="width: ${percentage}%"></div>
//           </div>
//         </div>
//       </div>

//       <!-- User Info -->
//       <div class="grid grid-cols-2 gap-3 mb-6">
//         <div class="bg-white p-3 rounded-lg border border-gray-200">
//           <p class="text-xs text-gray-500">Date Generated</p>
//           <p class="font-medium text-gray-800">${new Date().toLocaleDateString()}</p>
//         </div>
//         ${
//           email
//             ? `
//         <div class="bg-white p-3 rounded-lg border border-gray-200">
//           <p class="text-xs text-gray-500">Registered Email</p>
//           <p class="font-medium text-gray-800 truncate">${email}</p>
//         </div>
//         `
//             : ""
//         }
//       </div>

//       <!-- Download Button (Visible in PDF) -->
//       <div class="print:block hidden text-center mb-6">
//         <div class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
//           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//           </svg>
//           Downloaded Report
//         </div>
//       </div>

//       <!-- Answers Summary -->
//       <div class="mb-6">
//         <h4 class="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Your Answers</h4>
//         <div class="space-y-3">
//           ${generateAnswerSummary(answers, questions)}
//         </div>
//       </div>

//       <!-- Footer -->
//       <div class="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
//         <p>Generated by Health Assessment Bot • ${new Date().toLocaleString()}</p>
//       </div>
//     </div>

//     <!-- Download Button (Visible in Chat) -->
//     <div class="print:hidden mt-4 text-center">
//       <button data-download-pdf
//         class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md">
//         <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//         </svg>
//         Download Full Report (PDF)
//       </button>
//     </div>
//   `)
//   );
// };

// export const getAssessmentResults = (
//   score: number,
//   maxScore: number,
//   percentage: number,
//   topic: string,
//   answers: Record<number, string>,
//   questions: Question[],
//   email?: string
// ) => {
//   const grade =
//     percentage >= 90
//       ? "A"
//       : percentage >= 80
//       ? "B"
//       : percentage >= 70
//       ? "C"
//       : percentage >= 60
//       ? "D"
//       : "F";

//   const gradeColor = {
//     A: "bg-emerald-100 text-emerald-800",
//     B: "bg-teal-100 text-teal-800",
//     C: "bg-amber-100 text-amber-800",
//     D: "bg-orange-100 text-orange-800",
//     F: "bg-rose-100 text-rose-800",
//   }[grade];

//   return createBotMessage(
//     DOMPurify.sanitize(`
//     <div id="assessment-results" class="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
//       <!-- Header -->
//       <div class="text-center mb-6">
//         <div class="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner border border-indigo-100">
//           <span class="text-2xl text-indigo-600">📋</span>
//         </div>
//         <h3 class="text-2xl font-bold text-gray-800 mb-1">Assessment Report</h3>
//         <p class="text-indigo-600 font-medium">${topic}</p>
//       </div>

//       <!-- Score Card -->
//       <div class="bg-white/80 p-5 rounded-xl border border-indigo-100 shadow-xs mb-6 backdrop-blur-sm">
//         <div class="flex items-center justify-between mb-4">
//           <div>
//             <p class="text-sm text-indigo-600/80">Your Score</p>
//             <p class="text-3xl font-bold text-gray-800 mt-1">${score}<span class="text-gray-500 text-lg">/${maxScore}</span></p>
//           </div>
//           <div class="flex flex-col items-end">
//             <span class="text-sm text-indigo-600/80">Grade</span>
//             <span class="px-3 py-1 ${gradeColor} rounded-full text-sm font-bold mt-1">${grade}</span>
//           </div>
//         </div>

//         <!-- Progress Bar -->
//         <div class="mb-3">
//           <div class="flex justify-between text-sm text-indigo-600/80 mb-1">
//             <span>Completion</span>
//             <span>${percentage}%</span>
//           </div>
//           <div class="w-full bg-indigo-100 rounded-full h-2">
//             <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
//                  style="width: ${percentage}%"></div>
//           </div>
//         </div>
//       </div>

//       <!-- User Info -->
//       <div class="grid grid-cols-2 gap-3 mb-6">
//         <div class="bg-white/80 p-3 rounded-lg border border-indigo-100 backdrop-blur-sm">
//           <p class="text-xs text-indigo-600/80">Date Generated</p>
//           <p class="font-medium text-gray-800">${new Date().toLocaleDateString()}</p>
//         </div>
//         ${
//           email
//             ? `
//         <div class="bg-white/80 p-3 rounded-lg border border-indigo-100 backdrop-blur-sm">
//           <p class="text-xs text-indigo-600/80">Registered Email</p>
//           <p class="font-medium text-gray-800 truncate">${email}</p>
//         </div>
//         `
//             : ""
//         }
//       </div>

//       <!-- Answers Summary -->
//       <div class="mb-6">
//         <h4 class="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-indigo-100">Your Answers</h4>
//         <div class="space-y-3">
//           ${generateAnswerSummary(answers, questions)}
//         </div>
//       </div>

//       <!-- Download Button -->
//       <div class="text-center">
//         <button data-download-pdf
//           class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-md transition-all">
//           <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//           </svg>
//           Download Full Report (PDF)
//         </button>
//       </div>

//       <!-- Footer -->
//       <div class="mt-6 pt-4 border-t border-indigo-100 text-center text-xs text-indigo-600/60">
//         <p>Generated by Health Assessment Bot • ${new Date().toLocaleString()}</p>
//       </div>
//     </div>
//   `)
//   );
// };

export const getAssessmentResults = (
  score: number,
  maxScore: number,
  percentage: number,
  topic: string,
  answers: Record<number, string>,
  questions: Question[],
  email?: string
) => {
  // Custom color palette (HEX format)
  const colors = {
    primary: "#6366F1", // Indigo
    secondary: "#8B5CF6", // Purple
    lightBg: "#F5F7FF", // Very light indigo
    border: "#C7D2FE", // Light indigo
    textDark: "#1F2937", // Gray-800
    textLight: "#6B7280", // Gray-500
    white: "#FFFFFF",
    gradeA: "#ECFDF5", // Emerald-50
    gradeAText: "#065F46", // Emerald-800
    // Add other grade colors as needed
  };

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

  const gradeStyles = {
    A: `background-color: ${colors.gradeA}; color: ${colors.gradeAText};`,
    B: `background-color: #F0FDFA; color: #0D9488;`,
    C: `background-color: #FEFCE8; color: #92400E;`,
    D: `background-color: #FFF7ED; color: #9A3412;`,
    F: `background-color: #FEF2F2; color: #991B1B;`,
  }[grade];

  return createBotMessage(
    DOMPurify.sanitize(`
    <div id="assessment-results" style="
      background-color: ${colors.lightBg};
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid ${colors.border};
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="
          width: 4rem;
          height: 4rem;
          background-color: ${colors.white};
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          border: 1px solid ${colors.border};
        ">
          <span style="font-size: 1.5rem; color: ${colors.primary}">📋</span>
        </div>
        <h3 style="
          font-size: 1.5rem;
          font-weight: 700;
          color: ${colors.textDark};
          margin-bottom: 0.25rem;
        ">Assessment Report</h3>
        <p style="
          color: ${colors.primary};
          font-weight: 500;
        ">${topic}</p>
      </div>

      <!-- Score Card -->
      <div style="
        background-color: ${colors.white};
        padding: 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid ${colors.border};
        margin-bottom: 1.5rem;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div>
            <p style="font-size: 0.875rem; color: ${
              colors.primary
            }">Your Score</p>
            <p style="font-size: 1.875rem; font-weight: 700; color: ${
              colors.textDark
            }; margin-top: 0.25rem;">
              ${score}<span style="font-size: 1.125rem; color: ${
      colors.textLight
    }">/${maxScore}</span>
            </p>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <span style="font-size: 0.875rem; color: ${
              colors.primary
            }">Grade</span>
            <span style="
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 700;
              margin-top: 0.25rem;
              ${gradeStyles}
            ">${grade}</span>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: ${
            colors.primary
          }; margin-bottom: 0.25rem;">
            <span>Completion</span>
            <span>${percentage}%</span>
          </div>
          <div style="
            width: 100%;
            background-color: #E0E7FF;
            border-radius: 9999px;
            height: 0.5rem;
          ">
            <div style="
              background-color: ${colors.primary};
              height: 0.5rem;
              border-radius: 9999px;
              width: ${percentage}%;
            "></div>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div style="
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      ">
        <div style="
          background-color: ${colors.white};
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid ${colors.border};
        ">
          <p style="font-size: 0.75rem; color: ${
            colors.primary
          }">Date Generated</p>
          <p style="font-weight: 500; color: ${
            colors.textDark
          }">${new Date().toLocaleDateString()}</p>
        </div>
        ${
          email
            ? `
        <div style="
          background-color: ${colors.white};
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid ${colors.border};
        ">
          <p style="font-size: 0.75rem; color: ${colors.primary}">Registered Email</p>
          <p style="font-weight: 500; color: ${colors.textDark}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email}</p>
        </div>
        `
            : ""
        }
      </div>

      <!-- Answers Summary -->
      <div style="margin-bottom: 1.5rem;">
        <h4 style="
          font-size: 1.125rem;
          font-weight: 600;
          color: ${colors.textDark};
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${colors.border};
        ">Your Answers</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;" class="text-gray-800">
          ${generateAnswerSummary(answers, questions)}
        </div>
      </div>

    <!-- Download Button (will be removed in PDF) -->
    <div data-ignore-pdf style="text-align: center; margin-top: 24px;">
      <button data-download-pdf style="
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        background: #6366F1;
        color: white;
        border-radius: 8px;
        border: none;
        font-size: 14px;
        cursor: pointer;
      ">
        <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Download PDF Report
      </button>
    </div>

      <!-- Footer -->
      <div style="
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid ${colors.border};
        text-align: center;
        font-size: 0.75rem;
        color: ${colors.primary};
        opacity: 0.6;
      ">
        <p>Generated by Health Assessment Bot • ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `)
  );
};
