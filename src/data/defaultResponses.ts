export const DEFAULT_RESPONSES: Record<string, string> = {
  "What can you do?": `
      <div class="bot-message">
        <h3 class="font-bold text-lg mb-2">My Capabilities</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li>Conduct health assessments on various topics</li>
          <li>Provide personalized recommendations</li>
          <li>Analyze your responses and give scores</li>
          <li>Generate detailed reports</li>
        </ul>
        <p class="mt-2">Would you like to start an assessment?</p>
      </div>
    `,
  "Tell me about yourself": `
      <div class="bot-message">
        <h3 class="font-bold text-lg mb-2">About Me</h3>
        <p>I'm a health assessment bot designed to help you understand your health status across different areas including:</p>
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li>Physical health</li>
          <li>Nutrition</li>
          <li>Fitness</li>
          <li>Mental wellbeing</li>
        </ul>
        <p class="mt-2">I provide science-backed assessments and recommendations.</p>
      </div>
    `,
  "How does this work?": `
      <div class="bot-message">
        <h3 class="font-bold text-lg mb-2">Assessment Process</h3>
        <ol class="list-decimal pl-5 space-y-1">
          <li>Select a health topic</li>
          <li>Answer 8 multiple-choice questions (A/B/C/D)</li>
          <li>Get immediate scoring and feedback</li>
          <li>Receive personalized recommendations</li>
        </ol>
        <p class="mt-2">Each question has options ranked from D (lowest) to A (highest) based on health benefits.</p>
      </div>
    `,
  "Show me some examples": `
      <div class="bot-message">
        <h3 class="font-bold text-lg mb-2">Example Questions</h3>
        <div class="bg-slate-700/30 p-3 rounded-lg">
          <p class="font-medium">1. How often do you eat vegetables?</p>
          <ul class="list-disc pl-5 mt-1 space-y-1">
            <li><strong>D:</strong> Rarely</li>
            <li><strong>C:</strong> 1-2 servings/day</li>
            <li><strong>B:</strong> 3-4 servings/day</li>
            <li><strong>A:</strong> 5+ servings/day</li>
          </ul>
        </div>
        <div class="bg-slate-700/30 p-3 rounded-lg mt-2">
          <p class="font-medium">2. How often do you do strength training?</p>
          <ul class="list-disc pl-5 mt-1 space-y-1">
            <li><strong>D:</strong> Never</li>
            <li><strong>C:</strong> Once a week</li>
            <li><strong>B:</strong> 2-3 times/week</li>
            <li><strong>A:</strong> 4+ times/week</li>
          </ul>
        </div>
        <p class="mt-2">Would you like to start an assessment?</p>
      </div>
    `,
  "What's new?": `
      <div class="bot-message">
        <h3 class="font-bold text-lg mb-2">Recent Updates</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li>New mental wellbeing assessment added</li>
          <li>Detailed scoring breakdowns</li>
          <li>Improved recommendation engine</li>
          <li>Option to save your progress</li>
        </ul>
        <p class="mt-2">Let me know if you'd like to try any of our assessments!</p>
      </div>
    `,
};
