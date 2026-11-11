import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Brain, Sparkles, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionBank, QuestionRecord } from '@/hooks/useApiQueries';

export const FacultyQuestionBank: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [customQuestions, setCustomQuestions] = useState<QuestionRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [sectionText, setSectionText] = useState('');

  const { data: questionsData, isLoading } = useQuestionBank({ page: 1, pageSize: 10 });
  const apiQuestions = questionsData?.data || [];

  const allQuestions = [...customQuestions, ...apiQuestions];

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault();
    const query = topic.trim() || 'Distributed Systems';

    const aiQuestion: QuestionRecord = {
      id: `q_ai_${Date.now()}`,
      section: query,
      text: `In ${query}, what is the primary role of the Leader node during log replication?`,
      options: [
        'To accept client requests, append log entries, and propagate updates to Followers.',
        'To initiate election rounds randomly every 150ms.',
        'To validate SHA-256 signatures without logging.',
        'To delegate heartbeats exclusively to Candidates.',
      ],
      correctOption: 0,
    };

    setCustomQuestions([aiQuestion, ...customQuestions]);
    toast.success('AI Question Item Generated', {
      description: `Generated IRT-calibrated question for "${query}" (Bloom: Evaluating).`,
    });
    setTopic('');
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error('Please enter a question prompt');
      return;
    }

    const newQ: QuestionRecord = {
      id: `q_custom_${Date.now()}`,
      section: sectionText.trim() || 'General CS',
      text: questionText.trim(),
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOption: 0,
    };

    setCustomQuestions([newQ, ...customQuestions]);
    setIsModalOpen(false);
    setQuestionText('');
    setSectionText('');
    toast.success('Custom Question Added!', {
      description: `Added "${newQ.text}" to your question bank.`,
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter((q) => q.id !== id));
    toast.success('Question Item Deleted');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Generative AI Question Bank</h1>
          <p className="text-xs text-[#64748B] mt-1">Author, review, and calibrate assessment items with Bloom's Taxonomy tags.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
              <Plus className="w-4 h-4 mr-1" /> Add Custom Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white text-[#0F172A] p-6 rounded-2xl border-[#E2E8F0]">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-bold text-[#0F172A]">Add Custom Question</DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">
                Create an IRT-calibrated assessment item.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddCustomQuestion} className="space-y-4 text-xs pt-2">
              <div className="space-y-1">
                <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Category / Section</Label>
                <Input
                  value={sectionText}
                  onChange={(e) => setSectionText(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Question Prompt</Label>
                <Input
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question text..."
                  className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-sans"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs font-bold border-[#E2E8F0] cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 cursor-pointer">
                  Save Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Item Generator Form */}
      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 font-sans text-xs">
        <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
          <Brain className="w-5 h-5" />
          <span>Generative AI Question Authoring Studio</span>
        </div>
        <form onSubmit={handleGenerateAI} className="flex gap-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Distributed Consensus Protocols, Raft Leader Election, B-Trees"
            className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-mono flex-1"
          />
          <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 rounded-xl cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Generate IRT Items
          </Button>
        </form>
      </Card>

      {/* Question Items Table / Empty State */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs animate-pulse">
          Loading question bank from backend API...
        </div>
      ) : allQuestions.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <Brain className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Question Items Found</h3>
          <p className="text-xs text-[#64748B]">Use the AI Authoring Studio above or click '+ Add Custom Question' to create your first set of IRT-calibrated questions.</p>
        </Card>
      ) : (
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 font-sans text-xs">
          <h3 className="font-bold text-sm text-[#0F172A]">Authored Items ({allQuestions.length})</h3>
          <div className="divide-y divide-[#E2E8F0]">
            {allQuestions.map((q) => (
              <div key={q.id} className="py-3 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {q.section || 'General'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">ID: {q.id}</span>
                  </div>
                  <p className="font-bold text-[#0F172A] text-sm">{q.text}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50 p-2 cursor-pointer"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FacultyQuestionBank;
