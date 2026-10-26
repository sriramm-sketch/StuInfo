export type PerformanceBandKey = 
  | 'exceeding'
  | 'proficient'
  | 'developing'
  | 'foundational';

export interface PerformanceBandInfo {
  key: PerformanceBandKey;
  label: string;
  minScore: number;
  maxScore: number;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  summary: string;
  tone: 'celebratory' | 'positive' | 'supportive' | 'proactive';
}

export type ParticipationLevel = 'low' | 'moderate' | 'active' | 'very_active';
export type ResourceAccessLevel = 'limited' | 'moderate' | 'extensive';
export type StudySupportType = 'none' | 'peer_study' | 'formal_tutoring' | 'office_hours';

export interface StudentInput {
  id?: string;
  studentName?: string;
  ageRange?: string;
  gradeLevel: string;
  studyHoursPerWeek: number;
  classAttendancePct: number;
  previousScore: number;
  assignmentCompletionPct: number;
  participationLevel: ParticipationLevel;
  resourceAccess: ResourceAccessLevel;
  studySupport?: StudySupportType;
  extracurricularHours?: number;
  timestamp?: string;
}

export interface FactorImpact {
  id: string;
  name: string;
  category: 'strength' | 'growth_opportunity' | 'neutral';
  impactPoints: number; // positive or negative points relative to baseline
  userValue: string;
  benchmarkValue: string;
  description: string;
  actionableTip: string;
}

export interface PracticalRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'gentle';
  category: 'study_routine' | 'attendance' | 'support' | 'engagement' | 'wellbeing';
  title: string;
  description: string;
  estimatedScoreImpact: string;
  timeCommitment: string;
  firstStep: string;
}

export interface ModelMetadata {
  engineName: string;
  version: string;
  methodology: string;
  integrationStatus: 'demo_deterministic' | 'ml_connected';
  note: string;
}

export interface PredictionResult {
  id: string;
  studentName: string;
  gradeLevel: string;
  predictedScore: number;
  scoreRange: [number, number];
  performanceBand: PerformanceBandInfo;
  confidenceScore: number; // percentage (e.g. 88%)
  confidenceDescription: string;
  factors: FactorImpact[];
  strengths: FactorImpact[];
  growthAreas: FactorImpact[];
  recommendations: PracticalRecommendation[];
  disclaimer: string;
  calculatedAt: string;
  modelMetadata: ModelMetadata;
  inputs: StudentInput;
}

export interface WhatIfRequest {
  baseInputs: StudentInput;
  modifications: {
    studyHoursPerWeek?: number;
    classAttendancePct?: number;
    assignmentCompletionPct?: number;
    participationLevel?: ParticipationLevel;
    studySupport?: StudySupportType;
  };
}

export interface WhatIfResponse {
  originalScore: number;
  newScore: number;
  delta: number;
  newPerformanceBand: PerformanceBandInfo;
  explanation: string;
}

export interface EducatorStudentProfile {
  id: string;
  studentName: string;
  studentIdTag: string;
  gradeLevel: string;
  predictedScore: number;
  performanceBand: PerformanceBandInfo;
  attendancePct: number;
  studyHoursPerWeek: number;
  assignmentCompletionPct: number;
  previousScore: number;
  participationLevel: ParticipationLevel;
  checkInRecommended: boolean;
  checkInReason?: string;
  lastUpdated: string;
  notes: string[];
}

export interface CohortAnalytics {
  totalStudents: number;
  averagePredictedScore: number;
  checkInRecommendedCount: number;
  averageAttendance: number;
  averageStudyHours: number;
  bandDistribution: {
    bandKey: PerformanceBandKey;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  recentAssessments: {
    id: string;
    studentName: string;
    predictedScore: number;
    bandKey: PerformanceBandKey;
    date: string;
  }[];
}

export interface AICoachPlan {
  summary: string;
  personalizedStrengths: string[];
  fourWeekRoadmap: {
    week: string;
    focus: string;
    actionItems: string[];
  }[];
  suggestedStudyRoutines: {
    title: string;
    detail: string;
  }[];
  educatorConferenceTips: string[];
  isAIPowered: boolean;
  provider: string;
}
