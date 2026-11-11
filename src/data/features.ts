export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  size: 'large' | 'small';
  metric?: string;
}

export const BENTO_FEATURES: FeatureItem[] = [
  {
    id: 'ai-authoring',
    title: 'AI Question Builder',
    description:
      'Generate balanced question sets directly from your course syllabus or lecture slides. Set difficulty levels, refine distractors, and review every item before publishing.',
    tag: 'Save 10+ hours per exam',
    size: 'large',
    metric: 'Syllabus to exam in under 5 minutes',
  },
  {
    id: 'smart-proctoring',
    title: 'Smart Proctoring',
    description:
      'Flags unusual gaze shifts, tab switches, and room audio for human review. Runs privately on candidate devices without recording or streaming raw video to the cloud.',
    tag: 'Privacy-first verification',
    size: 'large',
    metric: 'Flags sent to invigilators in real time',
  },
  {
    id: 'ai-essay-grading',
    title: 'AI Essay Grading with Rubrics',
    description:
      'Evaluate written responses against your exact faculty rubrics with instant feedback and consistent scoring.',
    tag: 'Consistent & fast',
    size: 'small',
  },
  {
    id: 'offline-autosave',
    title: 'Works Offline, Autosaves Always',
    description:
      'Candidate responses save locally in real time. If campus Wi-Fi drops, the exam continues with zero interruption.',
    tag: 'Zero test loss',
    size: 'small',
  },
  {
    id: 'digital-badges',
    title: 'Digital Certificates & Badges',
    description:
      'Automatically issue tamper-proof digital completion certificates and badges as soon as final grades are approved.',
    tag: 'Instant issuance',
    size: 'small',
  },
  {
    id: 'detailed-analytics',
    title: 'Detailed Analytics & Item Health',
    description:
      'Spot poorly worded questions, view cohort score distributions, and benchmark question reliability across semesters.',
    tag: 'Continuous quality',
    size: 'small',
  },
  {
    id: 'multi-org-separation',
    title: 'Multi-Organization Data Separation',
    description:
      'Strict database-level isolation keeps every department, campus, and organization completely separate and private.',
    tag: 'Zero data leakage',
    size: 'small',
  },
];

export const ROLE_TABS = [
  {
    id: 'students',
    label: 'Students',
    headline: 'A calm, distraction-free test environment',
    description:
      'Students take exams in an intuitive interface that respects their privacy, saves their work automatically, and works reliably even on unstable internet connections.',
    benefits: [
      'No invasive video recording — verification runs privately on their own device',
      'Continuous offline autosave means zero lost progress if Wi-Fi cuts out',
      'Immediate access to grades, feedback rubrics, and digital certificates',
    ],
    demoUrl: '/student',
  },
  {
    id: 'educators',
    label: 'Educators',
    headline: 'Draft exams in minutes, grade in a fraction of the time',
    description:
      'Faculty members use AI as a tireless teaching assistant to generate topic-matched questions, verify syllabus coverage, and grade open-ended essays consistently.',
    benefits: [
      'Generate multiple-choice and essay questions with full editorial control',
      'AI-assisted rubric grading eliminates weeks of tedious grading marathons',
      'Clear psychometric insights show which topics students grasped best',
    ],
    demoUrl: '/faculty',
  },
  {
    id: 'invigilators',
    label: 'Invigilators',
    headline: 'Real-time visibility without the screen-watching fatigue',
    description:
      'Proctors monitor hundreds of candidates simultaneously with automated alerts that highlight only suspicious behavior for human verification.',
    benefits: [
      'Unified live dashboard flags tab-switching, secondary voices, and gaze drift',
      'Direct, private whisper communication with individual candidates if needed',
      'Time-stamped audit trails eliminate subjective dispute after the exam',
    ],
    demoUrl: '/invigilator',
  },
  {
    id: 'administrators',
    label: 'Administrators',
    headline: 'Enterprise control, compliance, and effortless scaling',
    description:
      'Department heads and deans manage campuses, enforce strict role permissions, and maintain full compliance with institutional standards.',
    benefits: [
      'Single sign-on (SSO) and roster sync with existing LMS tools',
      'Strict organization-level data separation protects institutional privacy',
      'Exportable audit logs and proof of compliance for accrediting boards',
    ],
    demoUrl: '/admin',
  },
];

