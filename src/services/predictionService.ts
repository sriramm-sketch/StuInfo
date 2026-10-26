import type {
  StudentInput,
  PredictionResult,
  PerformanceBandInfo,
  PerformanceBandKey,
  FactorImpact,
  PracticalRecommendation,
  ModelMetadata,
  WhatIfRequest,
  WhatIfResponse
} from '../types/index.ts';

/**
 * ---------------------------------------------------------------------------
 * STUDENT PERFORMANCE PREDICTION ENGINE (DEMO DETERMINISTIC METHOD)
 * ---------------------------------------------------------------------------
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This is a transparent, deterministic heuristic scoring engine built to
 * simulate educational trajectory analysis based on academic research on
 * high school and collegiate success indicators.
 * 
 * IT IS NOT A TRAINED MACHINE LEARNING MODEL.
 * We deliberately do NOT represent this rule-based simulation as artificial intelligence
 * or as a clinically validated psychometric test.
 * 
 * ===========================================================================
 * TODO: INTEGRATION POINT FOR REAL TRAINED MACHINE LEARNING MODEL
 * ===========================================================================
 * To connect a trained model (e.g., Random Forest, XGBoost, Neural Net, or ONNX):
 * 1. Replace the `calculateDeterministicScore()` method below with an API client
 *    call to your Python inference microservice (e.g., FastAPI + Scikit-Learn)
 *    or invoke an ONNX runtime session:
 * 
 *    ```typescript
 *    // Example real ML model integration:
 *    // const mlResponse = await fetch('https://ml-service.internal/predict', {
 *    //   method: 'POST',
 *    //   headers: { 'Content-Type': 'application/json' },
 *    //   body: JSON.stringify(formatInputsForModel(inputs))
 *    // });
 *    // return await mlResponse.json();
 *    ```
 * 2. Ensure feature scaling matches training distributions.
 * 3. Preserve the returned `PredictionResult` interface to keep UI components fully compatible.
 * ---------------------------------------------------------------------------
 */

export const PERFORMANCE_BANDS: Record<PerformanceBandKey, PerformanceBandInfo> = {
  exceeding: {
    key: 'exceeding',
    label: 'High Potential / Exceeding Expectations',
    minScore: 85,
    maxScore: 100,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700',
    accentBorder: 'border-emerald-500',
    summary: 'Demonstrating exceptional academic momentum, resilient study habits, and deep engagement.',
    tone: 'celebratory'
  },
  proficient: {
    key: 'proficient',
    label: 'On Track / Proficient',
    minScore: 70,
    maxScore: 84.9,
    badgeBg: 'badge-burgundy',
    badgeText: 'text-rose-800',
    accentBorder: 'border-rose-700',
    summary: 'Consistently meeting core learning targets with a reliable foundation and clear pathways for growth.',
    tone: 'positive'
  },
  developing: {
    key: 'developing',
    label: 'Developing / Target Support Recommended',
    minScore: 55,
    maxScore: 69.9,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-700',
    accentBorder: 'border-amber-500',
    summary: 'Building core comprehension; would benefit greatly from targeted study routines and structured check-ins.',
    tone: 'supportive'
  },
  foundational: {
    key: 'foundational',
    label: 'Foundational / Priority Check-in Suggested',
    minScore: 0,
    maxScore: 54.9,
    badgeBg: 'badge-burgundy',
    badgeText: 'text-rose-900',
    accentBorder: 'border-rose-900',
    summary: 'At a critical learning juncture where compassionate mentor outreach, adjusted workloads, or tutoring can unlock rapid progress.',
    tone: 'proactive'
  }
};

export function getPerformanceBand(score: number): PerformanceBandInfo {
  if (score >= 85) return PERFORMANCE_BANDS.exceeding;
  if (score >= 70) return PERFORMANCE_BANDS.proficient;
  if (score >= 55) return PERFORMANCE_BANDS.developing;
  return PERFORMANCE_BANDS.foundational;
}

/**
 * Calculates raw score using documented multi-factor weights.
 * Weight Distribution:
 * - Past Academic Baseline: 35%
 * - Weekly Study Hours: 25% (with optimal curve between 12-25 hrs)
 * - Class Attendance: 20%
 * - Assignment Completion: 12%
 * - Class Participation & Resources: 8%
 * + Supportive adjustments for Tutoring & Extracurricular balance
 */
export function calculateRawScore(input: StudentInput): {
  score: number;
  factors: FactorImpact[];
  confidenceScore: number;
  confidenceDescription: string;
} {
  // 1. Previous Score Factor (35% weight)
  // Baseline historical score normalized
  const prevScoreVal = input.previousScore;
  const prevScoreContribution = prevScoreVal * 0.35;

  // 2. Study Hours Factor (25% weight)
  // Optimal weekly study hours curve: 15-20 hours is ideal benchmark for high-level mastery
  // Diminishing returns after 25 hours to encourage rest & retention
  let studyHoursEffect = 0;
  if (input.studyHoursPerWeek <= 5) {
    studyHoursEffect = 40 + (input.studyHoursPerWeek / 5) * 20; // 40 -> 60
  } else if (input.studyHoursPerWeek <= 15) {
    studyHoursEffect = 60 + ((input.studyHoursPerWeek - 5) / 10) * 28; // 60 -> 88
  } else if (input.studyHoursPerWeek <= 25) {
    studyHoursEffect = 88 + ((input.studyHoursPerWeek - 15) / 10) * 10; // 88 -> 98
  } else {
    // Diminishing returns & fatigue cap
    studyHoursEffect = Math.min(100, 98 + ((input.studyHoursPerWeek - 25) / 15) * 2);
  }
  const studyHoursContribution = studyHoursEffect * 0.25;

  // 3. Attendance Factor (20% weight)
  // Direct linear correlation to instructional exposure
  const attendanceVal = input.classAttendancePct;
  const attendanceContribution = attendanceVal * 0.20;

  // 4. Assignment Completion Factor (12% weight)
  const assignmentVal = input.assignmentCompletionPct;
  const assignmentContribution = assignmentVal * 0.12;

  // 5. Participation & Resources (8% weight)
  const participationMap = { low: 50, moderate: 75, active: 90, very_active: 98 };
  const resourceMap = { limited: 60, moderate: 80, extensive: 98 };
  
  const participationScore = participationMap[input.participationLevel] || 75;
  const resourceScore = resourceMap[input.resourceAccess] || 80;
  const combinedEngagement = (participationScore * 0.6) + (resourceScore * 0.4);
  const engagementContribution = combinedEngagement * 0.08;

  // 6. Support & Extracurricular Adjustments (+/- bonus points)
  let supportBonus = 0;
  if (input.studySupport === 'formal_tutoring') supportBonus = 3.5;
  else if (input.studySupport === 'office_hours') supportBonus = 3.0;
  else if (input.studySupport === 'peer_study') supportBonus = 2.0;

  // Extracurricular balance: 5 to 15 hours is healthy cognitive balance (+1.5), >25 hrs may cause slight time crunch (-2.0)
  let extracurricularAdjustment = 0;
  const extraHours = input.extracurricularHours || 0;
  if (extraHours >= 4 && extraHours <= 16) {
    extracurricularAdjustment = 1.5;
  } else if (extraHours > 24) {
    extracurricularAdjustment = -2.0;
  }

  // Calculate final aggregated estimate
  let rawTotal = prevScoreContribution + studyHoursContribution + attendanceContribution + assignmentContribution + engagementContribution + supportBonus + extracurricularAdjustment;

  // Clamp within realistic educational bounds (25% to 98.5%)
  const finalScore = Math.min(98.5, Math.max(25.0, Math.round(rawTotal * 10) / 10));

  // Determine individual factor contributions and impact relative to benchmark average (75%)
  const factors: FactorImpact[] = [
    {
      id: 'past_performance',
      name: 'Academic Baseline & Prior Knowledge',
      category: prevScoreVal >= 75 ? 'strength' : prevScoreVal >= 60 ? 'neutral' : 'growth_opportunity',
      impactPoints: Math.round((prevScoreVal - 75) * 0.35 * 10) / 10,
      userValue: `${prevScoreVal}%`,
      benchmarkValue: '75%',
      description: prevScoreVal >= 75 
        ? 'Solid conceptual foundation from prior coursework provides strong momentum.' 
        : 'Prior concepts may need structured review to solidify upcoming advanced materials.',
      actionableTip: 'Dedicate 15 minutes at the start of each study block to reviewing fundamental prerequisites.'
    },
    {
      id: 'study_hours',
      name: 'Weekly Dedicated Study Time',
      category: input.studyHoursPerWeek >= 12 ? 'strength' : input.studyHoursPerWeek >= 8 ? 'neutral' : 'growth_opportunity',
      impactPoints: Math.round((studyHoursEffect - 75) * 0.25 * 10) / 10,
      userValue: `${input.studyHoursPerWeek} hrs/week`,
      benchmarkValue: '12-16 hrs/week',
      description: input.studyHoursPerWeek >= 12 
        ? 'Strong volume of focused revision allows deep processing and memory consolidation.'
        : 'Current weekly study hours are lower than average for this academic level, limiting practice repetition.',
      actionableTip: 'Try adding just two 45-minute focused study sessions per week using the Pomodoro technique.'
    },
    {
      id: 'attendance',
      name: 'Class Attendance & Teacher Contact',
      category: attendanceVal >= 88 ? 'strength' : attendanceVal >= 75 ? 'neutral' : 'growth_opportunity',
      impactPoints: Math.round((attendanceVal - 85) * 0.20 * 10) / 10,
      userValue: `${attendanceVal}%`,
      benchmarkValue: '85%+',
      description: attendanceVal >= 88
        ? 'High attendance ensures you experience explanations in context and catch spontaneous teacher tips.'
        : 'Absences create knowledge gaps that require extra independent effort to bridge later.',
      actionableTip: 'Review lecture notes within 24 hours of any missed class to prevent compounding backlogs.'
    },
    {
      id: 'assignments',
      name: 'Assignment & Project Completion',
      category: assignmentVal >= 85 ? 'strength' : assignmentVal >= 70 ? 'neutral' : 'growth_opportunity',
      impactPoints: Math.round((assignmentVal - 85) * 0.12 * 10) / 10,
      userValue: `${assignmentVal}%`,
      benchmarkValue: '85%+',
      description: assignmentVal >= 85
        ? 'High assignment completion provides consistent formative feedback and prevents end-of-term cramming.'
        : 'Unfinished assignments reduce chances for early mistake correction and lower cumulative grade buffers.',
      actionableTip: 'Break large assignments into three bite-sized milestones scheduled across the week.'
    },
    {
      id: 'engagement_resources',
      name: 'Active Participation & Resource Access',
      category: combinedEngagement >= 80 ? 'strength' : combinedEngagement >= 65 ? 'neutral' : 'growth_opportunity',
      impactPoints: Math.round((combinedEngagement - 75) * 0.08 * 10) / 10,
      userValue: `${input.participationLevel.replace('_', ' ')} / ${input.resourceAccess} resources`,
      benchmarkValue: 'Moderate to Active',
      description: combinedEngagement >= 80
        ? 'Proactive asking of questions and utilizing learning platforms cements conceptual clarity.'
        : 'Opportunities exist to engage more actively during discussions and tap into supplementary digital materials.',
      actionableTip: 'Prepare one clarifying question before entering each class to encourage active participation.'
    }
  ];

  // Calculate Confidence Score & Description
  // Confidence is higher when factors are congruent (low variance) and data points are complete
  const variances = [
    Math.abs(prevScoreVal - attendanceVal),
    Math.abs(prevScoreVal - assignmentVal),
    Math.abs(attendanceVal - assignmentVal)
  ];
  const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
  
  // Moderate to high confidence (76% to 92%)
  const confidenceScore = Math.round(Math.max(76, Math.min(93, 93 - (avgVariance * 0.35))));
  
  let confidenceDescription = 'High consistency across attendance, baseline grades, and study habits.';
  if (confidenceScore < 82) {
    confidenceDescription = 'Moderate consistency; differing patterns between attendance and test results create a wider variance range.';
  }

  return {
    score: finalScore,
    factors,
    confidenceScore,
    confidenceDescription
  };
}

/**
 * Generate 3 to 4 supportive, practical, non-stigmatizing recommendations
 * tailored specifically to the areas where the student has the highest potential for growth.
 */
export function generateRecommendations(
  input: StudentInput,
  score: number,
  factors: FactorImpact[]
): PracticalRecommendation[] {
  const recommendations: PracticalRecommendation[] = [];

  // Sort factors by most negative impact first
  const growthOpportunities = [...factors].sort((a, b) => a.impactPoints - b.impactPoints);
  const primaryGrowth = growthOpportunities[0];
  const secondaryGrowth = growthOpportunities[1];

  // 1. Study Habits Recommendation
  if (input.studyHoursPerWeek < 12) {
    recommendations.push({
      id: 'rec_study_blocks',
      priority: 'high',
      category: 'study_routine',
      title: 'Establish 45-Minute Protected Study Windows',
      description: `Increasing your weekly study from ${input.studyHoursPerWeek} to around 10-12 hours in short, focused sprints can significantly enhance retention without burnout.`,
      estimatedScoreImpact: '+4 to +7 points',
      timeCommitment: '45 mins, 4 days/week',
      firstStep: 'Pick two specific recurring time slots this week (e.g. Tuesday & Thursday 5:00 PM) exclusively for review.'
    });
  } else {
    recommendations.push({
      id: 'rec_active_recall',
      priority: 'medium',
      category: 'study_routine',
      title: 'Harness Active Recall & Self-Quizzing',
      description: 'You already invest admirable study time! Maximize its return by replacing passive re-reading with self-quizzing and flashcards (Spaced Repetition).',
      estimatedScoreImpact: '+3 to +5 points',
      timeCommitment: '20 mins per study session',
      firstStep: 'After reading a chapter, close your notes and write a 3-bullet summary from memory.'
    });
  }

  // 2. Attendance & Classroom Connection
  if (input.classAttendancePct < 85) {
    recommendations.push({
      id: 'rec_attendance_catchup',
      priority: 'high',
      category: 'attendance',
      title: 'Target an 8% Attendance Lift & Lecture Sync',
      description: 'Being physically or virtually present exposes you to implicit test hints, teacher emphasis, and organic Q&A that slide decks alone cannot replicate.',
      estimatedScoreImpact: '+5 to +8 points',
      timeCommitment: 'Regular scheduled class times',
      firstStep: 'Partner with a classmate to share quick 2-sentence key takeaway notes for any mandatory absence.'
    });
  } else if (input.assignmentCompletionPct < 85) {
    recommendations.push({
      id: 'rec_assignment_routine',
      priority: 'high',
      category: 'engagement',
      title: 'Sprint Ahead on Weekly Assignments',
      description: `Boosting assignment completion from ${input.assignmentCompletionPct}% to 90%+ ensures you earn full homework points and diagnose misunderstandings weeks before exam time.`,
      estimatedScoreImpact: '+4 to +6 points',
      timeCommitment: '30 mins every evening',
      firstStep: 'Start assignments on the day they are handed out—even just writing the title and outline.'
    });
  }

  // 3. Support & Collaborative Learning
  if (input.studySupport === 'none' || !input.studySupport) {
    recommendations.push({
      id: 'rec_seek_support',
      priority: 'medium',
      category: 'support',
      title: 'Connect with Peer Study Groups or Office Hours',
      description: 'Solo studying can sometimes feel isolating. Explaining concepts to a peer or visiting teacher office hours helps overcome stubborn roadblocks in minutes.',
      estimatedScoreImpact: '+3 to +6 points',
      timeCommitment: '1 hour weekly',
      firstStep: 'Drop in to your teacher\'s office hours this week with just one specific problem you found tricky.'
    });
  } else {
    recommendations.push({
      id: 'rec_peer_collaboration',
      priority: 'gentle',
      category: 'support',
      title: 'Leverage Collaborative Teach-Back Sessions',
      description: 'Take turns "teaching" difficult weekly topics to a study buddy. Teaching is proven to be the single most effective path to mastery.',
      estimatedScoreImpact: '+2 to +4 points',
      timeCommitment: '45 mins weekly',
      firstStep: 'Pick one difficult theorem or historical event and explain it to a peer in under 3 minutes.'
    });
  }

  // 4. Wellbeing & Cognitive Balance
  const extraHours = input.extracurricularHours || 0;
  if (extraHours > 20) {
    recommendations.push({
      id: 'rec_wellbeing_balance',
      priority: 'gentle',
      category: 'wellbeing',
      title: 'Protect Rest & Balance Busy Schedules',
      description: `With ${extraHours} hours devoted to extracurriculars, schedule non-negotiable sleep and unwind intervals to keep your memory sharp and stress levels healthy.`,
      estimatedScoreImpact: 'Sustains peak cognitive clarity',
      timeCommitment: '7-8 hours sleep nightly',
      firstStep: 'Set a daily digital cut-off 45 minutes before sleep to optimize memory consolidation.'
    });
  } else {
    recommendations.push({
      id: 'rec_goal_tracking',
      priority: 'gentle',
      category: 'wellbeing',
      title: 'Celebrate Small Weekly Micro-Wins',
      description: 'Academic growth is built on compounding small habits. Acknowledge each completed chapter or homework milestone to sustain genuine enthusiasm.',
      estimatedScoreImpact: 'Long-term motivation boost',
      timeCommitment: '2 minutes every Friday',
      firstStep: 'Write down your single best academic accomplishment at the end of this week.'
    });
  }

  return recommendations;
}

/**
 * Main prediction generator: receives validated input and outputs a complete,
 * empathetic, documented prediction response.
 */
export function generatePrediction(input: StudentInput): PredictionResult {
  const { score, factors, confidenceScore, confidenceDescription } = calculateRawScore(input);
  const performanceBand = getPerformanceBand(score);

  // Score uncertainty range (e.g. 78% +/- 3.5%)
  const margin = Math.round((100 - confidenceScore) * 0.35 * 10) / 10;
  const scoreRange: [number, number] = [
    Math.max(20, Math.round((score - margin) * 10) / 10),
    Math.min(100, Math.round((score + margin) * 10) / 10)
  ];

  const strengths = factors.filter(f => f.category === 'strength');
  const growthAreas = factors.filter(f => f.category === 'growth_opportunity');

  const recommendations = generateRecommendations(input, score, factors);

  const modelMetadata: ModelMetadata = {
    engineName: 'Empathetic Student Success Simulator (Rule-Based Demo Engine)',
    version: '1.2.0-demo',
    methodology: 'Multi-factor weighted heuristic modeling with diminishing-returns study curves and consistency variance analysis.',
    integrationStatus: 'demo_deterministic',
    note: 'Deterministic demo prediction service. Replaceable with a machine-learning regression/classification model via predictionService.ts.'
  };

  const disclaimer = 'Notice: This predicted score is an educational estimate calculated from the self-reported factors above. It is intended solely as an encouraging guide to identify proactive support strategies and study habits. It is NOT an official academic grade, diagnostic assessment, or guarantee of future performance.';

  return {
    id: input.id || `pred_${Date.now()}`,
    studentName: input.studentName || 'Student',
    gradeLevel: input.gradeLevel,
    predictedScore: score,
    scoreRange,
    performanceBand,
    confidenceScore,
    confidenceDescription,
    factors,
    strengths,
    growthAreas,
    recommendations,
    disclaimer,
    calculatedAt: new Date().toISOString(),
    modelMetadata,
    inputs: input
  };
}

/**
 * Interactive What-If Scenario Simulator:
 * Allows students to test hypothetical habit changes (e.g., +3 study hours or +10% attendance)
 * and see the estimated impact immediately.
 */
export function simulateWhatIf(request: WhatIfRequest): WhatIfResponse {
  const baseResult = generatePrediction(request.baseInputs);
  
  const modifiedInputs: StudentInput = {
    ...request.baseInputs,
    studyHoursPerWeek: request.modifications.studyHoursPerWeek ?? request.baseInputs.studyHoursPerWeek,
    classAttendancePct: request.modifications.classAttendancePct ?? request.baseInputs.classAttendancePct,
    assignmentCompletionPct: request.modifications.assignmentCompletionPct ?? request.baseInputs.assignmentCompletionPct,
    participationLevel: request.modifications.participationLevel ?? request.baseInputs.participationLevel,
    studySupport: request.modifications.studySupport ?? request.baseInputs.studySupport
  };

  const newResult = generatePrediction(modifiedInputs);
  const delta = Math.round((newResult.predictedScore - baseResult.predictedScore) * 10) / 10;

  let explanation = '';
  if (delta > 0) {
    explanation = `Making these positive adjustments is estimated to boost your academic outcome by approximately +${delta} points into the ${newResult.performanceBand.label} band!`;
  } else if (delta < 0) {
    explanation = `Reducing these study commitments could lead to an estimated drop of ${Math.abs(delta)} points. Consistent weekly rhythms protect your momentum.`;
  } else {
    explanation = 'These adjustments maintain your current steady trajectory with balanced habits.';
  }

  return {
    originalScore: baseResult.predictedScore,
    newScore: newResult.predictedScore,
    delta,
    newPerformanceBand: newResult.performanceBand,
    explanation
  };
}
