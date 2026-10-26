import type { StudentInput, PredictionResult, AICoachPlan } from '../types/index.ts';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

/**
 * Intelligent AI Academic Coach & Study Roadmap Generator.
 * Uses Groq LLM inference when online, and seamlessly falls back
 * to our comprehensive heuristic academic guidance engine when offline.
 */
export async function generateAICoachPlan(prediction: PredictionResult): Promise<AICoachPlan> {
  // Try Groq API first if key exists
  if (GROQ_API_KEY) {
    try {
      const plan = await callGroqAPI(prediction);
      if (plan) return plan;
    } catch (err: any) {
      console.log('Notice: Groq API request fallback to heuristic coach (network/offline):', err.message);
    }
  }

  // Graceful, comprehensive offline heuristic coach fallback
  return generateHeuristicCoachPlan(prediction);
}

/**
 * Connects to Groq OpenAI-compatible Chat Completions API
 */
async function callGroqAPI(prediction: PredictionResult): Promise<AICoachPlan | null> {
  const prompt = `
You are a warm, empathetic, and expert educational mentor and academic advisor.
A student has generated an academic performance estimate with the following profile:

- Name/Nickname: ${prediction.studentName}
- Grade Level: ${prediction.gradeLevel}
- Predicted Score: ${prediction.predictedScore}% (${prediction.performanceBand.label})
- Score Range: ${prediction.scoreRange[0]}% - ${prediction.scoreRange[1]}%
- Study Hours: ${prediction.inputs.studyHoursPerWeek} hrs/week
- Class Attendance: ${prediction.inputs.classAttendancePct}%
- Assignment Completion: ${prediction.inputs.assignmentCompletionPct}%
- Participation Level: ${prediction.inputs.participationLevel}
- Resource Access: ${prediction.inputs.resourceAccess}
- Study Support: ${prediction.inputs.studySupport || 'none'}
- Extracurriculars: ${prediction.inputs.extracurricularHours || 0} hrs/week

Top Strengths:
${prediction.strengths.map(s => `- ${s.name}: ${s.description}`).join('\n')}

Key Growth Opportunities:
${prediction.growthAreas.map(g => `- ${g.name}: ${g.description}`).join('\n')}

Please generate a supportive, practical, non-stigmatizing academic coaching plan.
Return ONLY valid JSON matching this exact structure (no markdown wrappers, no backticks):
{
  "summary": "2-3 sentences of encouraging, positive guidance explaining that this prediction is a launching pad, not a ceiling.",
  "personalizedStrengths": ["Strength 1 observation", "Strength 2 observation"],
  "fourWeekRoadmap": [
    {
      "week": "Week 1: Establishing Rhythm & Fundamentals",
      "focus": "Core focus of this week",
      "actionItems": ["Action 1", "Action 2", "Action 3"]
    },
    {
      "week": "Week 2: Active Engagement & Practice",
      "focus": "Core focus of this week",
      "actionItems": ["Action 1", "Action 2"]
    },
    {
      "week": "Week 3: Deep Synthesis & Support",
      "focus": "Core focus of this week",
      "actionItems": ["Action 1", "Action 2"]
    },
    {
      "week": "Week 4: Review, Reflection & Exam Readiness",
      "focus": "Core focus of this week",
      "actionItems": ["Action 1", "Action 2"]
    }
  ],
  "suggestedStudyRoutines": [
    {
      "title": "Specific Routine or Technique Name",
      "detail": "How the student should apply this routine this week"
    },
    {
      "title": "Second Routine Name",
      "detail": "Application detail"
    }
  ],
  "educatorConferenceTips": [
    "Supportive question for the teacher or advisor to ask",
    "Encouraging observation for the advisor to share"
  ]
}
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are an inspiring, encouraging educational mentor. Respond only with clean JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1200
    }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Groq API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content?.trim();
  if (!rawText) return null;

  // Clean JSON response
  const cleaned = rawText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    ...parsed,
    isAIPowered: true,
    provider: `Groq (${GROQ_MODEL})`
  };
}

/**
 * Robust heuristic coaching generator that produces rich, tailored plans offline
 */
function generateHeuristicCoachPlan(prediction: PredictionResult): AICoachPlan {
  const { inputs, predictedScore, performanceBand, studentName } = prediction;
  const name = studentName || 'Student';

  const strengthsList = prediction.strengths.length > 0 
    ? prediction.strengths.map(s => `${s.name}: ${s.description}`)
    : [
        'Demonstrates clear dedication to continuous learning and self-improvement.',
        'Proactively assessing academic patterns is the first step toward significant performance leaps.'
      ];

  const fourWeekRoadmap = [
    {
      week: 'Week 1: Routine Reset & Anchor Habits',
      focus: 'Audit weekly time allocation and set up two non-negotiable study anchors.',
      actionItems: [
        `Lock in ${Math.min(inputs.studyHoursPerWeek + 2, 16)} total weekly study hours divided across 3-4 consistent days.`,
        'Create a dedicated, distraction-free study space with phone placed in another room during review blocks.',
        'Download and print syllabus milestones for all current subjects to map upcoming major deliverables.'
      ]
    },
    {
      week: 'Week 2: Active Recall & In-Class Sync',
      focus: 'Transition from passive re-reading to high-yield retrieval practice and attendance consistency.',
      actionItems: [
        `Ensure attendance reaches at least 90%+ this week to catch direct teacher cues and core discussions.`,
        'Implement 5-minute pre-reading before lectures to prime conceptual recognition.',
        'Utilize active flashcards (Anki or Quizlet) for core formulas and terminology.'
      ]
    },
    {
      week: 'Week 3: Collaborative Check-ins & Milestone Feedback',
      focus: 'Leverage peer support and clarify confusing concepts with instructors early.',
      actionItems: [
        'Attend at least one teacher office hour or peer study session with 2 specific practice questions.',
        'Submit weekly assignments at least 24 hours prior to deadline to avoid late penalties and rush stress.',
        'Conduct a 30-minute mid-cycle self-quiz under realistic timed conditions.'
      ]
    },
    {
      week: 'Week 4: Synthesis, Spaced Review & Celebration',
      focus: 'Consolidate knowledge networks and celebrate measurable weekly consistency.',
      actionItems: [
        'Synthesize core chapter summaries onto single-page visual concept sheets (mind maps).',
        'Teach a complex concept out loud to a peer or study partner (the Feynman Technique).',
        'Review progress against your initial baseline and set your goals for the next academic sprint!'
      ]
    }
  ];

  const suggestedStudyRoutines = [
    {
      title: 'The 45/10 Focused Study Block (Modified Pomodoro)',
      detail: 'Engage in 45 minutes of unbroken single-task study followed by a strict 10-minute movement or hydration break. Studies show 45 minutes aligns cleanly with human attention spans.'
    },
    {
      title: 'Spaced Retrieval Calendar',
      detail: 'Revisit difficult topics on Day 1, Day 3, Day 7, and Day 14. This spacing curve turns fragile short-term recall into durable long-term working memory.'
    },
    {
      title: 'Active Summarization (The Feynman Check)',
      detail: 'Instead of highlighting textbook passages, close the book and explain the concept in your own words as if speaking to a 12-year-old. Wherever you hesitate reveals an exact knowledge gap.'
    }
  ];

  const educatorConferenceTips = [
    `Ask ${name}: "Which subject topic has felt most exciting or approachable to you recently, and where has friction popped up?"`,
    `Acknowledge ${name}'s positive foundation in ${prediction.strengths[0]?.name || 'consistent effort'} before discussing areas for growth.`,
    'Collaborate on a realistic micro-target: e.g., turning in the next two homework sets on time with peer review.'
  ];

  return {
    summary: `Hello ${name}! Your estimated score of ${predictedScore}% (${performanceBand.label}) shows strong potential. Remember, this prediction is simply a snapshot of your current inputs—not a ceiling or a fixed destiny. By making modest adjustments to weekly study structure and staying connected in class, you can build remarkable momentum.`,
    personalizedStrengths: strengthsList,
    fourWeekRoadmap,
    suggestedStudyRoutines,
    educatorConferenceTips,
    isAIPowered: false,
    provider: 'Heuristic Academic Guidance Engine (Deterministic Educational Research)'
  };
}
