export interface TestimonialItem {
  id: string;
  avatarText: string;
  starRating: number;
  quote: string;
  name: string;
  role: string;
  institution: string;
  isPlaceholder?: boolean;
}

export const TESTIMONIALS_NOTE = 'Sample feedback placeholders. Replace with real design partner quotes.';

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    avatarText: 'EV',
    starRating: 5,
    quote:
      '{{TESTIMONIAL: "AssessIQ helped our department eliminate the 2-week grading lag for midterms. Our professors love the rubric assistant, and our students appreciated not having invasive video recordings."}}',
    name: 'Dr. Elena Vance',
    role: 'Associate Dean of Assessment',
    institution: 'School of Science & Engineering',
    isPlaceholder: true,
  },
  {
    id: 't2',
    avatarText: 'MT',
    starRating: 5,
    quote:
      '{{TESTIMONIAL: "Generating topic-specific questions from our syllabus saved our subject-matter experts dozens of hours. The review flow gave our faculty complete confidence in the final exams."}}',
    name: 'Marcus Thorne',
    role: 'Director of Certification',
    institution: 'National Allied Health Board',
    isPlaceholder: true,
  },
  {
    id: 't3',
    avatarText: 'SJ',
    starRating: 5,
    quote:
      '{{TESTIMONIAL: "When campus internet flickered during our 800-student final, AssessIQ did not drop a single student response. The offline autosave alone made this our best software decision this year."}}',
    name: 'Sarah Jenkins',
    role: 'Lead Testing Coordinator',
    institution: 'Polytechnic Institute',
    isPlaceholder: true,
  },
];
