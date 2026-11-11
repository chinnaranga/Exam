export interface UseCaseItem {
  id: string;
  title: string;
  badge: string;
  painPoint: string;
  solution: string;
  outcome: string;
  href: string;
}

export const USE_CASES: UseCaseItem[] = [
  {
    id: 'universities',
    title: 'Universities & Colleges',
    badge: 'Higher Education',
    painPoint:
      'Midterm and final exam weeks overwhelm professors with hundreds of hours of manual grading, while large lecture halls make fair in-person proctoring difficult.',
    solution:
      'AssessIQ gives professors an AI-powered grading assistant that scores essays against their exact rubrics, with built-in proctoring that works in any browser.',
    outcome: 'Grades released in 24 hours instead of 3 weeks, with zero faculty burnout.',
    href: '#demo',
  },
  {
    id: 'certification',
    title: 'Certification & Licensure Bodies',
    badge: 'Professional Licensure',
    painPoint:
      'High-stakes exams face constant threats from leaked question banks and candidates using secondary screens or covert assistance.',
    solution:
      'AssessIQ dynamically varies numerical values and distractors while smart proctoring flags unauthorized browser switching and second-voice audio.',
    outcome: 'Tamper-resistant exams and instant digital credential delivery to passing candidates.',
    href: '#demo',
  },
  {
    id: 'corporate',
    title: 'Corporate Training Teams',
    badge: 'Enterprise L&D',
    painPoint:
      'Compliance and technical assessments take too long to build, pull employees away from work, and provide weak signal on actual retention.',
    solution:
      'Training managers turn existing training documents into verified skill assessments in minutes and track team competencies on an automated dashboard.',
    outcome: 'Cut assessment creation time by 80% with verifiable compliance audit trails.',
    href: '#demo',
  },
  {
    id: 'government',
    title: 'Government Exam Boards',
    badge: 'Public Sector',
    painPoint:
      'Running large-scale civil service tests across remote regions suffers from weak internet connections and heavy logistical overhead.',
    solution:
      'AssessIQ runs entirely in the browser with full offline autosave, ensuring no test is ever lost when regional Wi-Fi drops.',
    outcome: 'Equitable, reliable examination delivery across urban centers and rural test centers.',
    href: '#demo',
  },
];

