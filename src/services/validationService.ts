import type { StudentInput, ParticipationLevel, ResourceAccessLevel, StudySupportType } from '../types/index.ts';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function sanitizeString(val: unknown, fallback: string = ''): string {
  if (typeof val !== 'string') return fallback;
  return val
    .trim()
    .replace(/[<>]/g, '') // Basic anti-XSS stripping
    .slice(0, 100);
}

export function parseNumberInRange(
  val: unknown,
  min: number,
  max: number,
  defaultValue: number
): { value: number; error?: string } {
  if (val === undefined || val === null || val === '') {
    return { value: defaultValue };
  }
  const num = Number(val);
  if (isNaN(num)) {
    return { value: defaultValue, error: `Must be a valid number between ${min} and ${max}` };
  }
  if (num < min || num > max) {
    return { value: Math.min(Math.max(num, min), max), error: `Must be between ${min} and ${max}` };
  }
  return { value: Math.round(num * 10) / 10 };
}

export function validateStudentInput(input: any): ValidationResult<StudentInput> {
  const errors: Record<string, string> = {};

  // Student Name / Nickname (optional, default to "Student")
  const studentName = sanitizeString(input?.studentName, 'Student');
  const ageRange = sanitizeString(input?.ageRange, '15-18');
  
  // Grade Level
  const allowedGrades = [
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade',
    'Undergraduate Year 1',
    'Undergraduate Year 2+',
    'Graduate / Advanced'
  ];
  let gradeLevel = sanitizeString(input?.gradeLevel, '11th Grade');
  if (!allowedGrades.includes(gradeLevel)) {
    gradeLevel = '11th Grade';
  }

  // Study hours per week: 0 to 60 (recommended default: 12)
  const studyHoursRes = parseNumberInRange(input?.studyHoursPerWeek, 0, 60, 12);
  if (studyHoursRes.error) errors.studyHoursPerWeek = studyHoursRes.error;

  // Class Attendance %: 0 to 100 (recommended default: 85)
  const attendanceRes = parseNumberInRange(input?.classAttendancePct, 0, 100, 85);
  if (attendanceRes.error) errors.classAttendancePct = attendanceRes.error;

  // Previous Score %: 0 to 100 (recommended default: 75)
  const prevScoreRes = parseNumberInRange(input?.previousScore, 0, 100, 75);
  if (prevScoreRes.error) errors.previousScore = prevScoreRes.error;

  // Assignment Completion %: 0 to 100 (recommended default: 85)
  const assignmentRes = parseNumberInRange(input?.assignmentCompletionPct, 0, 100, 85);
  if (assignmentRes.error) errors.assignmentCompletionPct = assignmentRes.error;

  // Participation Level: 'low' | 'moderate' | 'active' | 'very_active'
  const validParticipation: ParticipationLevel[] = ['low', 'moderate', 'active', 'very_active'];
  const participationLevel: ParticipationLevel = validParticipation.includes(input?.participationLevel)
    ? input.participationLevel
    : 'moderate';

  // Resource Access: 'limited' | 'moderate' | 'extensive'
  const validResources: ResourceAccessLevel[] = ['limited', 'moderate', 'extensive'];
  const resourceAccess: ResourceAccessLevel = validResources.includes(input?.resourceAccess)
    ? input.resourceAccess
    : 'moderate';

  // Study Support: 'none' | 'peer_study' | 'formal_tutoring' | 'office_hours'
  const validSupport: StudySupportType[] = ['none', 'peer_study', 'formal_tutoring', 'office_hours'];
  const studySupport: StudySupportType = validSupport.includes(input?.studySupport)
    ? input.studySupport
    : 'peer_study';

  // Extracurricular hours: 0 to 40 (default 6)
  const extraHoursRes = parseNumberInRange(input?.extracurricularHours, 0, 40, 6);
  if (extraHoursRes.error) errors.extracurricularHours = extraHoursRes.error;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const validatedData: StudentInput = {
    id: input?.id || `stu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentName: studentName || 'Student',
    ageRange,
    gradeLevel,
    studyHoursPerWeek: studyHoursRes.value,
    classAttendancePct: attendanceRes.value,
    previousScore: prevScoreRes.value,
    assignmentCompletionPct: assignmentRes.value,
    participationLevel,
    resourceAccess,
    studySupport,
    extracurricularHours: extraHoursRes.value,
    timestamp: new Date().toISOString()
  };

  return {
    success: true,
    data: validatedData
  };
}
