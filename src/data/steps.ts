export interface StepItem {
  number: string;
  title: string;
  description: string;
  outcome: string;
}

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Set up your organization',
    description: 'Import users, create academic departments, and connect your existing LMS or single sign-on directory.',
    outcome: 'Outcome: Ready for your entire campus or team in under 30 minutes.',
  },
  {
    number: '02',
    title: 'Generate and review questions',
    description: 'Paste your syllabus or lecture notes. AI drafts multiple-choice and essay questions for your faculty to approve or edit.',
    outcome: 'Outcome: High-quality question sets assembled in minutes, not weeks.',
  },
  {
    number: '03',
    title: 'Deliver the exam securely',
    description: 'Candidates take tests in a distraction-free window. Smart proctoring flags anomalies, and offline autosave guards against Wi-Fi drops.',
    outcome: 'Outcome: A fair, reliable testing experience with zero lost candidate answers.',
  },
  {
    number: '04',
    title: 'Grade and certify automatically',
    description: 'Automated grading for objective items and AI-assisted rubric scoring for essays. Results and verified certificates issue instantly.',
    outcome: 'Outcome: Turnaround time cut from weeks to minutes.',
  },
];
