export interface ComparisonRow {
  feature: string;
  description: string;
  assessIq: boolean | string;
  traditional: boolean | string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'AI question generation',
    description: 'Draft questions from syllabus topics and edit before publishing',
    assessIq: true,
    traditional: false,
  },
  {
    feature: 'AI-assisted essay grading',
    description: 'Evaluate written responses against faculty rubrics in seconds',
    assessIq: true,
    traditional: false,
  },
  {
    feature: 'Privacy-respecting proctoring',
    description: 'On-device behavioral flags for human review without cloud video storage',
    assessIq: true,
    traditional: false,
  },
  {
    feature: 'Offline autosave mode',
    description: 'Ensures candidates never lose test progress during Wi-Fi drops',
    assessIq: true,
    traditional: false,
  },
  {
    feature: 'Verifiable digital certificates',
    description: 'Automated tamper-proof badges issued upon grade approval',
    assessIq: true,
    traditional: false,
  },
  {
    feature: 'Setup time',
    description: 'Time needed to deploy a fully functioning pilot exam',
    assessIq: 'Under 1 day',
    traditional: '4 to 8 weeks',
  },
];

