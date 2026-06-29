import { GoogleGenerativeAI } from '@google/generative-ai';

let _client = null;

export function initGemini(apiKey) {
  if (!apiKey) return null;
  _client = new GoogleGenerativeAI(apiKey);
  return _client;
}

export function getGeminiClient(apiKey) {
  if (_client) return _client;
  if (apiKey) return initGemini(apiKey);
  return null;
}

export async function generateMotivationalQuote(context, apiKey) {
  const client = getGeminiClient(apiKey);
  if (!client) return getFallbackQuote();
  try {
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const result = await model.generateContent(
      `Generate ONE short powerful motivational quote (max 2 sentences) for a student: ${context}. Make it personal and energizing. No quote marks, no author attribution.`
    );
    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini Error:", err);
    return getFallbackQuote();
  }
}

export async function generateTaskRecommendation(tasks, profile, apiKey) {
  const client = getGeminiClient(apiKey);
  if (!client) return "Start with your smallest pending tasks to build momentum, then tackle high-priority items with upcoming deadlines.";
  try {
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const pending = tasks
      .filter(t => t.status === 'pending' || t.status === 'in_progress')
      .slice(0, 8)
      .map(t => `"${t.title}" (importance:${t.importance}/5, ${t.deadline ? `deadline:${new Date(t.deadline).toLocaleDateString()}` : 'no deadline'}, est:${t.time_estimate}h)`);
    const result = await model.generateContent(
      `You are a productivity coach. Student tasks:\n${pending.join('\n')}\nProductivity type: "${profile?.productivity_type || 'unknown'}". Give a 3-4 sentence specific recommendation on what to tackle first and why. Be encouraging but direct.`
    );
    return result.response.text().trim();
  } catch {
    return "Focus on your most urgent tasks first, then systematically work through lower-priority items.";
  }
}

export async function analyzeProductivityPersonality(stats, apiKey) {
  const client = getGeminiClient(apiKey);
  if (!client) return analyzeLocalPersonality(stats);
  try {
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const result = await model.generateContent(
      `Determine productivity personality from stats:\n- Completed: ${stats.completed}\n- Postponed: ${stats.postponed}\n- On time: ${stats.onTime}\n- Late: ${stats.late}\n- Avg/week: ${stats.avgPerWeek.toFixed(1)}\n\nTypes: Sprinter, Consistent Worker, Perfectionist, Procrastinator\nRespond ONLY with valid JSON: {"type":"...","description":"2 sentences","strengths":["...","..."],"tips":["...","..."]}`
    );
    return JSON.parse(result.response.text().trim());
  } catch {
    return analyzeLocalPersonality(stats);
  }
}

export async function chatWithCoach(messages, userMessage, tasks, apiKey) {
  const client = getGeminiClient(apiKey);
  if (!client) return "Add your Gemini API key in Settings to enable AI coaching. Get a free key from Google AI Studio at aistudio.google.com/apikey";
  try {
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed').length;
    const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'Student' : 'Coach'}: ${m.content}`).join('\n');
    const result = await model.generateContent(
      `You are Task Catalyst, a motivating productivity coach for students. Context: ${pending} pending tasks, ${overdue} overdue. Be concise (max 3 sentences unless asked for more), empathetic, actionable.\n\nConversation:\n${history}\nStudent: ${userMessage}\nCoach:`
    );
    return result.response.text().trim();
  } catch {
    return "I'm having trouble connecting. Please verify your API key in Settings.";
  }
}

function analyzeLocalPersonality(stats) {
  const postponeRate = stats.postponed / Math.max(1, stats.completed + stats.postponed);
  const lateRate = stats.late / Math.max(1, stats.completed);
  if (postponeRate > 0.4 && lateRate > 0.4) return { type: 'Procrastinator', description: 'You tend to delay tasks, but awareness is the first step to change.', strengths: ['Can handle pressure', 'Resourceful under constraints'], tips: ['Break tasks into 25-min Pomodoro sessions', 'Use the 2-minute rule: if under 2 min, do it now'] };
  if (lateRate > 0.5 && postponeRate < 0.2) return { type: 'Sprinter', description: 'You thrive under deadline pressure and produce great work in bursts.', strengths: ['High intensity focus', 'Deadline-driven performance'], tips: ['Create artificial deadlines to trigger sprint mode earlier', 'Use time estimates to plan your sprints'] };
  if (stats.avgPerWeek < 2 && stats.completed > 5) return { type: 'Perfectionist', description: 'You invest deeply in each task, ensuring high quality output.', strengths: ['High quality work', 'Thorough approach'], tips: ['Set a "good enough" standard to ship faster', 'Timebox tasks to prevent over-engineering'] };
  return { type: 'Consistent Worker', description: 'You work steadily and complete tasks reliably.', strengths: ['Reliable', 'Steady pace'], tips: ['Try time-blocking to maximize efficiency', 'Take on stretch goals'] };
}

const FALLBACK_QUOTES = [
  "The secret of getting ahead is getting started. Every line of code you write today brings you closer to the engineer you're becoming.",
  "Your consistency compounds. Each solved problem is not just a solved problem — it's a stronger mind.",
  "Deadlines are not walls. They're starting guns. You already have what it takes to run.",
  "Progress, not perfection. Ship something, learn everything, then make it better tomorrow.",
  "Every expert was once a beginner who refused to quit. Your streak continues today.",
  "Small tasks completed is momentum built. Clear your list, clear your mind.",
  "You don't rise to the level of your goals. You fall to the level of your systems. Build good ones.",
];

function getFallbackQuote() {
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}
