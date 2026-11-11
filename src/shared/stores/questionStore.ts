import { create } from 'zustand';

export interface QuestionItem {
  id: string;
  code: string;
  stem: string;
  type: 'MULTIPLE_CHOICE' | 'MULTIPLE_SELECT' | 'CODING' | 'ESSAY';
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  subject: string;
  bloomsLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  irtDifficulty: number; // Beta (-3.0 to +3.0)
  irtDiscrimination: number; // Alpha (0.5 to 2.5)
  irtGuessing: number; // Gamma (0.0 to 0.3)
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  author: string;
  createdAt: string;
}

interface QuestionState {
  questions: QuestionItem[];
  selectedQuestion: QuestionItem | null;
  filterSubject: string;
  filterBlooms: string;
  filterStatus: string;
  searchQuery: string;
  setSelectedQuestion: (q: QuestionItem | null) => void;
  setFilterSubject: (sub: string) => void;
  setFilterBlooms: (b: string) => void;
  setFilterStatus: (st: string) => void;
  setSearchQuery: (q: string) => void;
  addQuestion: (q: Omit<QuestionItem, 'id' | 'createdAt'>) => void;
  updateStatus: (id: string, status: QuestionItem['status']) => void;
}

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-101',
    code: 'CS-402-Q1',
    stem: 'Evaluate the leader election failure scenarios in Raft consensus under 200ms network partition latency.',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Split-vote scenarios occur when heartbeats timeout simultaneously.', isCorrect: true },
      { id: 'opt-2', text: 'The leader immediately steps down without term incrementation.', isCorrect: false },
      { id: 'opt-3', text: 'Uncommitted log entries are forcefully committed across minority nodes.', isCorrect: false },
      { id: 'opt-4', text: 'Followers increment election terms without granting votes.', isCorrect: false },
    ],
    explanation: 'Raft prevents split votes by introducing randomized election timeouts between 150ms and 300ms.',
    subject: 'Computer Science',
    bloomsLevel: 'EVALUATE',
    irtDifficulty: 1.45,
    irtDiscrimination: 1.82,
    irtGuessing: 0.25,
    status: 'APPROVED',
    author: 'Prof. Arthur Vance',
    createdAt: '2026-07-28',
  },
  {
    id: 'q-102',
    code: 'MED-801-Q4',
    stem: 'Which physiological mechanism primarily compensates for acute metabolic acidosis in renal failure?',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Hyperventilation leading to respiratory alkalosis (Kussmaul breathing).', isCorrect: true },
      { id: 'opt-2', text: 'Increased renal tubular reabsorption of phosphate ions.', isCorrect: false },
      { id: 'opt-3', text: 'Hepatic conversion of lactate to glucose via gluconeogenesis.', isCorrect: false },
      { id: 'opt-4', text: 'Intracellular sequestration of bicarbonate ions.', isCorrect: false },
    ],
    explanation: 'Chemoreceptors trigger respiratory compensation via increased minute ventilation to lower PaCO2.',
    subject: 'Medicine',
    bloomsLevel: 'ANALYZE',
    irtDifficulty: 0.85,
    irtDiscrimination: 1.64,
    irtGuessing: 0.20,
    status: 'APPROVED',
    author: 'Dr. Sarah Jenkins',
    createdAt: '2026-07-27',
  },
  {
    id: 'q-103',
    code: 'EE-304-Q9',
    stem: 'Design a VHDL architecture for a 4-bit synchronous BCD counter with asynchronous active-low reset.',
    type: 'CODING',
    options: [],
    explanation: 'Requires process statement sensitive to clk and rst_n signals with modular check for q = 9.',
    subject: 'Electrical Engineering',
    bloomsLevel: 'CREATE',
    irtDifficulty: 2.10,
    irtDiscrimination: 2.05,
    irtGuessing: 0.00,
    status: 'PENDING_REVIEW',
    author: 'AI Copilot Studio',
    createdAt: '2026-07-29',
  },
];

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: INITIAL_QUESTIONS,
  selectedQuestion: INITIAL_QUESTIONS[0],
  filterSubject: 'ALL',
  filterBlooms: 'ALL',
  filterStatus: 'ALL',
  searchQuery: '',
  setSelectedQuestion: (q) => set({ selectedQuestion: q }),
  setFilterSubject: (sub) => set({ filterSubject: sub }),
  setFilterBlooms: (b) => set({ filterBlooms: b }),
  setFilterStatus: (st) => set({ filterStatus: st }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  addQuestion: (q) =>
    set((state) => {
      const newQuestion: QuestionItem = {
        ...q,
        id: `q-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return { questions: [newQuestion, ...state.questions], selectedQuestion: newQuestion };
    }),
  updateStatus: (id, status) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, status } : q)),
    })),
}));
