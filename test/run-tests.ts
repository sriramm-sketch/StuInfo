import { validateStudentInput } from '../src/services/validationService.ts';
import { generatePrediction, simulateWhatIf, getPerformanceBand } from '../src/services/predictionService.ts';
import { generateAICoachPlan } from '../src/services/aiCoachService.ts';
import { getFilteredStudents, getCohortAnalytics } from '../src/services/educatorService.ts';
import type { StudentInput } from '../src/types/index.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE SYSTEM VERIFICATION TESTS');
console.log('====================================================\n');

// 1. Validation Tests
console.log('Testing Input Validation Service:');
{
  const validPayload = {
    studentName: 'Alex Jordan',
    gradeLevel: '11th Grade',
    studyHoursPerWeek: 14,
    classAttendancePct: 92,
    previousScore: 84,
    assignmentCompletionPct: 90,
    participationLevel: 'active',
    resourceAccess: 'moderate'
  };
  const res = validateStudentInput(validPayload);
  assert(res.success === true, 'Valid payload passes validation');
  assert(res.data?.studentName === 'Alex Jordan', 'Sanitized name is preserved');
  assert(res.data?.studyHoursPerWeek === 14, 'Study hours parsed correctly');

  // Edge case: out of bounds validation errors
  const outOfBounds = {
    studentName: '<b>Hack</b>',
    studyHoursPerWeek: 999, // Should trigger error
    classAttendancePct: -50  // Should trigger error
  };
  const edgeRes = validateStudentInput(outOfBounds);
  assert(edgeRes.success === false, 'Rejects out of bounds with validation errors');
  assert(!!edgeRes.errors?.studyHoursPerWeek, 'Identifies invalid study hours range');
  assert(!!edgeRes.errors?.classAttendancePct, 'Identifies invalid attendance range');
}

// 2. Prediction Engine Deterministic Behavior
console.log('\nTesting Prediction Engine Determinism & Accuracy:');
{
  const inputA: StudentInput = {
    studentName: 'Jordan',
    gradeLevel: '10th Grade',
    studyHoursPerWeek: 16,
    classAttendancePct: 95,
    previousScore: 85,
    assignmentCompletionPct: 95,
    participationLevel: 'active',
    resourceAccess: 'extensive',
    studySupport: 'peer_study',
    extracurricularHours: 8
  };

  const pred1 = generatePrediction(inputA);
  const pred2 = generatePrediction(inputA);

  assert(pred1.predictedScore === pred2.predictedScore, 'Deterministic scoring: identical inputs yield exact same score');
  assert(pred1.predictedScore >= 85, 'High engagement student scores in Exceeding band');
  assert(pred1.performanceBand.key === 'exceeding', 'Band correctly identified as exceeding');
  assert(pred1.scoreRange[0] < pred1.predictedScore && pred1.predictedScore < pred1.scoreRange[1], 'Predicted score falls strictly within uncertainty range');
  assert(pred1.strengths.length > 0, 'Identifies positive strengths');
  assert(pred1.recommendations.length >= 3, 'Generates at least 3 practical recommendations');
  assert(pred1.modelMetadata.integrationStatus === 'demo_deterministic', 'Metadata identifies demo deterministic engine');
}

// 3. Performance Bands Coverage
console.log('\nTesting Performance Band Thresholds:');
{
  assert(getPerformanceBand(92).key === 'exceeding', '92% maps to Exceeding');
  assert(getPerformanceBand(78).key === 'proficient', '78% maps to Proficient');
  assert(getPerformanceBand(62).key === 'developing', '62% maps to Developing');
  assert(getPerformanceBand(45).key === 'foundational', '45% maps to Foundational');
}

// 4. What-If Scenario Simulation
console.log('\nTesting Interactive What-If Simulation:');
{
  const baseInput: StudentInput = {
    studentName: 'Sam',
    gradeLevel: '11th Grade',
    studyHoursPerWeek: 6,
    classAttendancePct: 75,
    previousScore: 70,
    assignmentCompletionPct: 70,
    participationLevel: 'moderate',
    resourceAccess: 'moderate'
  };

  const simResult = simulateWhatIf({
    baseInputs: baseInput,
    modifications: {
      studyHoursPerWeek: 16, // +10 study hours
      classAttendancePct: 95  // +20% attendance
    }
  });

  assert(simResult.newScore > simResult.originalScore, 'Increasing study hours and attendance boosts score');
  assert(simResult.delta > 0, `Positive delta computed (+${simResult.delta} points)`);
  assert(simResult.explanation.includes('boost'), 'Explanation encourages positive growth');
}

// 5. Educator Service & Cohort Analytics
console.log('\nTesting Educator Service & Filters:');
{
  const analytics = getCohortAnalytics();
  assert(analytics.totalStudents >= 10, 'Cohort contains realistic seeded student population');
  assert(analytics.averagePredictedScore > 0, 'Cohort average score is calculated');
  assert(analytics.checkInRecommendedCount > 0, 'Identifies students recommended for supportive check-ins');
  assert(analytics.bandDistribution.length === 4, 'Includes all 4 performance bands in distribution');

  // Filter tests
  const filteredGrade = getFilteredStudents({ grade: '11th Grade' });
  assert(filteredGrade.students.every(s => s.gradeLevel === '11th Grade'), 'Grade filter correctly scopes students');

  const filteredCheckIn = getFilteredStudents({ checkInOnly: true });
  assert(filteredCheckIn.students.every(s => s.checkInRecommended === true), 'Check-in only filter scopes correctly');

  const searchResults = getFilteredStudents({ search: 'Chen' });
  assert(searchResults.students.some(s => s.studentName.includes('Chen')), 'Search queries match name successfully');
}

// 6. AI Academic Coach Generation (Heuristic Fallback Verification)
console.log('\nTesting AI Academic Coach Blueprint:');
{
  const samplePrediction = generatePrediction({
    studentName: 'Taylor',
    gradeLevel: '12th Grade',
    studyHoursPerWeek: 10,
    classAttendancePct: 82,
    previousScore: 75,
    assignmentCompletionPct: 80,
    participationLevel: 'moderate',
    resourceAccess: 'moderate'
  });

  const coachPlan = await generateAICoachPlan(samplePrediction);
  assert(coachPlan.summary.length > 20, 'Generates inspiring coaching summary');
  assert(coachPlan.fourWeekRoadmap.length === 4, 'Generates complete 4-week structured roadmap');
  assert(coachPlan.suggestedStudyRoutines.length >= 2, 'Suggests practical cognitive routines');
  assert(coachPlan.educatorConferenceTips.length >= 2, 'Provides supportive advisor discussion prompts');
}

console.log('\n====================================================');
console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
