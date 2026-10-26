import type {
  EducatorStudentProfile,
  CohortAnalytics,
  PerformanceBandKey,
  ParticipationLevel
} from '../types/index.ts';
import { getPerformanceBand, PERFORMANCE_BANDS } from './predictionService.ts';

// Demo seed dataset representing a realistic, diverse academic cohort
let studentDatabase: EducatorStudentProfile[] = [
  {
    id: 'stu_101',
    studentName: 'Maya Chen',
    studentIdTag: 'STU-9021',
    gradeLevel: '11th Grade',
    predictedScore: 92.4,
    performanceBand: PERFORMANCE_BANDS.exceeding,
    attendancePct: 96,
    studyHoursPerWeek: 18,
    assignmentCompletionPct: 98,
    previousScore: 90,
    participationLevel: 'very_active',
    checkInRecommended: false,
    lastUpdated: '2026-10-24T09:30:00Z',
    notes: [
      'Exceptional grasp of analytical concepts.',
      'Active contributor to peer study groups.'
    ]
  },
  {
    id: 'stu_102',
    studentName: 'Marcus Vance',
    studentIdTag: 'STU-9022',
    gradeLevel: '10th Grade',
    predictedScore: 61.2,
    performanceBand: PERFORMANCE_BANDS.developing,
    attendancePct: 74,
    studyHoursPerWeek: 6,
    assignmentCompletionPct: 68,
    previousScore: 65,
    participationLevel: 'low',
    checkInRecommended: true,
    checkInReason: 'Attendance dropped below 75% and assignment backlog accumulating; high natural curiosity when engaged.',
    lastUpdated: '2026-10-25T11:15:00Z',
    notes: [
      'Missed several Friday morning lab sessions.',
      'Recommended for morning study hall or peer buddy pairing.'
    ]
  },
  {
    id: 'stu_103',
    studentName: 'Sophia Rodriguez',
    studentIdTag: 'STU-9023',
    gradeLevel: '12th Grade',
    predictedScore: 84.8,
    performanceBand: PERFORMANCE_BANDS.proficient,
    attendancePct: 92,
    studyHoursPerWeek: 14,
    assignmentCompletionPct: 92,
    previousScore: 82,
    participationLevel: 'active',
    checkInRecommended: false,
    lastUpdated: '2026-10-23T14:20:00Z',
    notes: [
      'Steady, dependable academic routine.',
      'Preparing for college entrance examinations.'
    ]
  },
  {
    id: 'stu_104',
    studentName: 'Devon Reed',
    studentIdTag: 'STU-9024',
    gradeLevel: '11th Grade',
    predictedScore: 52.1,
    performanceBand: PERFORMANCE_BANDS.foundational,
    attendancePct: 68,
    studyHoursPerWeek: 4,
    assignmentCompletionPct: 55,
    previousScore: 58,
    participationLevel: 'low',
    checkInRecommended: true,
    checkInReason: 'Critical learning juncture: significant conceptual gaps in core prerequisites; proactive mentor check-in strongly advised.',
    lastUpdated: '2026-10-25T16:45:00Z',
    notes: [
      'Expressed anxiety regarding timed tests.',
      'Parent-educator conference scheduled for next Tuesday.'
    ]
  },
  {
    id: 'stu_105',
    studentName: 'Aaliyah Patel',
    studentIdTag: 'STU-9025',
    gradeLevel: '9th Grade',
    predictedScore: 88.5,
    performanceBand: PERFORMANCE_BANDS.exceeding,
    attendancePct: 98,
    studyHoursPerWeek: 15,
    assignmentCompletionPct: 95,
    previousScore: 86,
    participationLevel: 'active',
    checkInRecommended: false,
    lastUpdated: '2026-10-24T10:00:00Z',
    notes: [
      'Rapidly adapting to high school coursework.',
      'Strong collaborative problem-solving skills.'
    ]
  },
  {
    id: 'stu_106',
    studentName: 'Liam O\'Connor',
    studentIdTag: 'STU-9026',
    gradeLevel: '10th Grade',
    predictedScore: 73.0,
    performanceBand: PERFORMANCE_BANDS.proficient,
    attendancePct: 84,
    studyHoursPerWeek: 10,
    assignmentCompletionPct: 80,
    previousScore: 74,
    participationLevel: 'moderate',
    checkInRecommended: false,
    lastUpdated: '2026-10-22T13:10:00Z',
    notes: [
      'Consistent mid-term scores.',
      'Could benefit from advanced problem sets.'
    ]
  },
  {
    id: 'stu_107',
    studentName: 'Zara Morales',
    studentIdTag: 'STU-9027',
    gradeLevel: '12th Grade',
    predictedScore: 66.8,
    performanceBand: PERFORMANCE_BANDS.developing,
    attendancePct: 78,
    studyHoursPerWeek: 8,
    assignmentCompletionPct: 75,
    previousScore: 70,
    participationLevel: 'moderate',
    checkInRecommended: true,
    checkInReason: 'Senior capstone workload causing mild pacing strain; needs guidance on prioritizing deadlines.',
    lastUpdated: '2026-10-25T08:50:00Z',
    notes: [
      'Balancing part-time job with schoolwork.',
      'Provided flexible submission extensions.'
    ]
  },
  {
    id: 'stu_108',
    studentName: 'Ethan Wright',
    studentIdTag: 'STU-9028',
    gradeLevel: '11th Grade',
    predictedScore: 79.5,
    performanceBand: PERFORMANCE_BANDS.proficient,
    attendancePct: 89,
    studyHoursPerWeek: 12,
    assignmentCompletionPct: 85,
    previousScore: 77,
    participationLevel: 'moderate',
    checkInRecommended: false,
    lastUpdated: '2026-10-21T15:05:00Z',
    notes: [
      'Well-rounded participation in student council.',
      'Maintains solid homework completion.'
    ]
  },
  {
    id: 'stu_109',
    studentName: 'Chloe Kim',
    studentIdTag: 'STU-9029',
    gradeLevel: '9th Grade',
    predictedScore: 94.1,
    performanceBand: PERFORMANCE_BANDS.exceeding,
    attendancePct: 100,
    studyHoursPerWeek: 16,
    assignmentCompletionPct: 100,
    previousScore: 92,
    participationLevel: 'very_active',
    checkInRecommended: false,
    lastUpdated: '2026-10-24T12:30:00Z',
    notes: [
      'Perfect attendance record this quarter.',
      'Assists peers during lab experiments.'
    ]
  },
  {
    id: 'stu_110',
    studentName: 'Jordan Taylor',
    studentIdTag: 'STU-9030',
    gradeLevel: '10th Grade',
    predictedScore: 58.4,
    performanceBand: PERFORMANCE_BANDS.developing,
    attendancePct: 71,
    studyHoursPerWeek: 5,
    assignmentCompletionPct: 62,
    previousScore: 62,
    participationLevel: 'low',
    checkInRecommended: true,
    checkInReason: 'Low participation and inconsistent homework submission; student shows strong verbal understanding when prompted 1-on-1.',
    lastUpdated: '2026-10-26T09:10:00Z',
    notes: [
      'Prefers non-public feedback.',
      'Engages enthusiastically in visual learning tasks.'
    ]
  },
  {
    id: 'stu_111',
    studentName: 'Priya Sharma',
    studentIdTag: 'STU-9031',
    gradeLevel: 'Undergraduate Year 1',
    predictedScore: 82.2,
    performanceBand: PERFORMANCE_BANDS.proficient,
    attendancePct: 91,
    studyHoursPerWeek: 15,
    assignmentCompletionPct: 88,
    previousScore: 80,
    participationLevel: 'active',
    checkInRecommended: false,
    lastUpdated: '2026-10-23T11:45:00Z',
    notes: [
      'Adapting well to university lecture formats.',
      'Frequently uses campus library study rooms.'
    ]
  },
  {
    id: 'stu_112',
    studentName: 'Lucas Silva',
    studentIdTag: 'STU-9032',
    gradeLevel: 'Undergraduate Year 1',
    predictedScore: 68.3,
    performanceBand: PERFORMANCE_BANDS.developing,
    attendancePct: 80,
    studyHoursPerWeek: 9,
    assignmentCompletionPct: 72,
    previousScore: 71,
    participationLevel: 'moderate',
    checkInRecommended: true,
    checkInReason: 'Transitions to independent collegiate pacing; would benefit from academic counseling on time management.',
    lastUpdated: '2026-10-25T14:15:00Z',
    notes: [
      'Referred to university writing clinic.',
      'Showed noticeable improvement on second essay.'
    ]
  }
];

export interface StudentFilters {
  search?: string;
  grade?: string;
  band?: string;
  checkInOnly?: boolean;
}

export function getFilteredStudents(filters: StudentFilters = {}): {
  students: EducatorStudentProfile[];
  total: number;
} {
  let list = [...studentDatabase];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      s => s.studentName.toLowerCase().includes(q) || s.studentIdTag.toLowerCase().includes(q)
    );
  }

  if (filters.grade && filters.grade !== 'all') {
    list = list.filter(s => s.gradeLevel === filters.grade);
  }

  if (filters.band && filters.band !== 'all') {
    list = list.filter(s => s.performanceBand.key === filters.band);
  }

  if (filters.checkInOnly) {
    list = list.filter(s => s.checkInRecommended);
  }

  return {
    students: list,
    total: list.length
  };
}

export function getStudentById(id: string): EducatorStudentProfile | undefined {
  return studentDatabase.find(s => s.id === id);
}

export function getCohortAnalytics(): CohortAnalytics {
  const totalStudents = studentDatabase.length;
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      averagePredictedScore: 0,
      checkInRecommendedCount: 0,
      averageAttendance: 0,
      averageStudyHours: 0,
      bandDistribution: [],
      recentAssessments: []
    };
  }

  const sumScore = studentDatabase.reduce((acc, s) => acc + s.predictedScore, 0);
  const sumAtt = studentDatabase.reduce((acc, s) => acc + s.attendancePct, 0);
  const sumHours = studentDatabase.reduce((acc, s) => acc + s.studyHoursPerWeek, 0);
  const checkInCount = studentDatabase.filter(s => s.checkInRecommended).length;

  const bandCounts: Record<PerformanceBandKey, number> = {
    exceeding: 0,
    proficient: 0,
    developing: 0,
    foundational: 0
  };

  studentDatabase.forEach(s => {
    bandCounts[s.performanceBand.key] = (bandCounts[s.performanceBand.key] || 0) + 1;
  });

  const bandDistribution = [
    {
      bandKey: 'exceeding' as PerformanceBandKey,
      label: 'Exceeding (85%+)',
      count: bandCounts.exceeding,
      percentage: Math.round((bandCounts.exceeding / totalStudents) * 100),
      color: '#10B981' // emerald
    },
    {
      bandKey: 'proficient' as PerformanceBandKey,
      label: 'Proficient (70-84%)',
      count: bandCounts.proficient,
      percentage: Math.round((bandCounts.proficient / totalStudents) * 100),
      color: '#881337' // rich burgundy
    },
    {
      bandKey: 'developing' as PerformanceBandKey,
      label: 'Developing (55-69%)',
      count: bandCounts.developing,
      percentage: Math.round((bandCounts.developing / totalStudents) * 100),
      color: '#D97706' // warm amber
    },
    {
      bandKey: 'foundational' as PerformanceBandKey,
      label: 'Foundational (<55%)',
      count: bandCounts.foundational,
      percentage: Math.round((bandCounts.foundational / totalStudents) * 100),
      color: '#9F1239' // burgundy rose
    }
  ];

  const recentAssessments = [...studentDatabase]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      studentName: s.studentName,
      predictedScore: s.predictedScore,
      bandKey: s.performanceBand.key,
      date: s.lastUpdated
    }));

  return {
    totalStudents,
    averagePredictedScore: Math.round((sumScore / totalStudents) * 10) / 10,
    checkInRecommendedCount: checkInCount,
    averageAttendance: Math.round((sumAtt / totalStudents) * 10) / 10,
    averageStudyHours: Math.round((sumHours / totalStudents) * 10) / 10,
    bandDistribution,
    recentAssessments
  };
}

export function addStudentToCohort(studentData: {
  studentName: string;
  gradeLevel: string;
  studyHoursPerWeek: number;
  attendancePct: number;
  assignmentCompletionPct: number;
  previousScore: number;
  participationLevel: ParticipationLevel;
  notes?: string;
}): EducatorStudentProfile {
  // Approximate score for educator view
  const approxScore = Math.min(98.5, Math.max(30, Math.round(
    (studentData.previousScore * 0.35 +
     Math.min(100, studentData.studyHoursPerWeek * 5) * 0.25 +
     studentData.attendancePct * 0.20 +
     studentData.assignmentCompletionPct * 0.12 +
     75 * 0.08) * 10
  ) / 10));

  const band = getPerformanceBand(approxScore);
  const checkIn = studentData.attendancePct < 75 || approxScore < 60;

  const newStudent: EducatorStudentProfile = {
    id: `stu_${Date.now()}`,
    studentName: studentData.studentName || 'Student Demo',
    studentIdTag: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    gradeLevel: studentData.gradeLevel,
    predictedScore: approxScore,
    performanceBand: band,
    attendancePct: studentData.attendancePct,
    studyHoursPerWeek: studentData.studyHoursPerWeek,
    assignmentCompletionPct: studentData.assignmentCompletionPct,
    previousScore: studentData.previousScore,
    participationLevel: studentData.participationLevel,
    checkInRecommended: checkIn,
    checkInReason: checkIn 
      ? 'Recent performance metrics indicate an opportune moment for supportive mentorship.'
      : undefined,
    lastUpdated: new Date().toISOString(),
    notes: studentData.notes ? [studentData.notes] : ['Added via educator quick entry.']
  };

  studentDatabase.unshift(newStudent);
  return newStudent;
}

export function exportCohortCSV(): string {
  const headers = [
    'Student ID',
    'Student Name',
    'Grade Level',
    'Predicted Score (%)',
    'Performance Band',
    'Attendance (%)',
    'Weekly Study Hours',
    'Assignment Completion (%)',
    'Check-in Recommended',
    'Last Updated'
  ];

  const rows = studentDatabase.map(s => [
    `"${s.studentIdTag}"`,
    `"${s.studentName}"`,
    `"${s.gradeLevel}"`,
    s.predictedScore,
    `"${s.performanceBand.label}"`,
    s.attendancePct,
    s.studyHoursPerWeek,
    s.assignmentCompletionPct,
    s.checkInRecommended ? 'Yes' : 'No',
    `"${new Date(s.lastUpdated).toLocaleDateString()}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function resetDemoCohort(): void {
  // Resets to initial sample seed
}
