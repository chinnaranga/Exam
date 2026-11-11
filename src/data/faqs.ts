export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'How does AI question generation work?',
    answer:
      'You can paste lecture notes, course syllabus outlines, or textbook chapters. AssessIQ analyzes the core concepts and automatically drafts balanced multiple-choice, short-answer, and essay questions tailored to your desired difficulty level.',
  },
  {
    question: 'Can we review AI questions before use?',
    answer:
      'Yes, absolutely. AI never publishes questions without your explicit approval. Faculty members have complete editorial control to edit question stems, adjust answer keys, regenerate distractors, or discard questions at any time.',
  },
  {
    question: 'How does proctoring protect privacy?',
    answer:
      'Unlike intrusive legacy proctoring that records hours of room video to third-party servers, AssessIQ runs lightweight computer vision models directly inside the candidate’s browser. Gaze anomalies and sound level changes are flagged for human invigilator review locally, and raw video feeds are never permanently stored.',
  },
  {
    question: 'Does it work with poor internet?',
    answer:
      'Yes. The candidate exam runner saves every response and keystroke locally in encrypted browser storage. If a student loses internet connectivity during the test, they can keep answering questions without interruption. The exam automatically syncs all answers the moment connectivity returns.',
  },
  {
    question: 'How is our data secured and separated?',
    answer:
      'AssessIQ uses database-level row-level security and tenant isolation. Your student records, question repositories, and gradebooks are strictly partitioned and cannot be accessed by any other organization. All data is encrypted with AES-256 at rest and TLS 1.3 in transit.',
  },
  {
    question: 'How long does onboarding take?',
    answer:
      'Most departments and testing teams launch their first pilot exam in less than 24 hours. Because AssessIQ runs entirely in the browser, students and faculty do not need to install browser extensions, desktop apps, or kernel-level drivers.',
  },
];
