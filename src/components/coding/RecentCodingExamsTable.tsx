import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodingExamItem } from '@/types/codingDashboard';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

interface TableProps {
  exams: CodingExamItem[];
  isLoading?: boolean;
}

export const RecentCodingExamsTable: React.FC<TableProps> = ({ exams, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const pageSize = 5;

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredExams.length / pageSize) || 1;
  const paginatedExams = filteredExams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedExams.length === paginatedExams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(paginatedExams.map((e) => e.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedExams.includes(id)) {
      setSelectedExams(selectedExams.filter((item) => item !== id));
    } else {
      setSelectedExams([...selectedExams, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    toast.success(`Executed bulk action "${action}" on ${selectedExams.length} exams.`);
    setSelectedExams([]);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider font-mono flex items-center">
          <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2 inline-block" />
          Section 3: Recent Coding Examinations
        </h2>
        <span className="text-xs text-[#64748B] font-mono">
          Showing {filteredExams.length} Exam Roster Records
        </span>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        {/* Table Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input
                placeholder="Search coding exam by title, code, or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-[#E2E8F0] text-xs rounded-xl focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status Filter */}
            <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-xl p-1 bg-slate-50 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {['ALL', 'RUNNING', 'PUBLISHED', 'DRAFT', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                    statusFilter === status
                      ? 'bg-white text-[#0F6CBD] font-bold shadow-2xs border border-slate-200'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Bulk Actions Button */}
            {selectedExams.length > 0 && (
              <Button
                onClick={() => handleBulkAction('Export Blueprint')}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 bg-blue-50 font-bold text-xs rounded-xl"
              >
                Bulk Action ({selectedExams.length})
              </Button>
            )}
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-slate-50 text-[#64748B] font-mono uppercase text-[10px] tracking-wider">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedExams.length > 0 && selectedExams.length === paginatedExams.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="p-3">Exam Name</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Status</th>
                <th className="p-3">Problems</th>
                <th className="p-3">Languages</th>
                <th className="p-3">Candidates</th>
                <th className="p-3">Submissions</th>
                <th className="p-3">Start Time</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-mono">
                    Loading exam telemetry data...
                  </td>
                </tr>
              ) : paginatedExams.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No Coding Exams Found</p>
                    <p className="text-[#64748B] text-xs">No examination records match your current search or status filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedExams.includes(exam.id)}
                        onChange={() => toggleSelect(exam.id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-semibold text-[#0F172A]">
                      <div className="font-bold">{exam.title}</div>
                      <span className="text-[10px] font-mono text-[#0F6CBD]">{exam.id}</span>
                    </td>
                    <td className="p-3 text-[#64748B] font-medium">{exam.organization}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          exam.status === 'RUNNING'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
                            : exam.status === 'PUBLISHED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : exam.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#0F172A]">{exam.problemCount} Problems</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {exam.languages.slice(0, 3).map((lang) => (
                          <span key={lang} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                            {lang}
                          </span>
                        ))}
                        {exam.languages.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono font-semibold">
                            +{exam.languages.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#0F172A]">{exam.candidateCount}</td>
                    <td className="p-3 font-mono font-semibold text-emerald-700">{exam.submissionCount}</td>
                    <td className="p-3 text-[#64748B] font-mono text-[11px]">{exam.startTime}</td>
                    <td className="p-3 text-right">
                      <Button
                        onClick={() => toast.info(`Viewing details for ${exam.title}`)}
                        variant="ghost"
                        size="sm"
                        className="text-[#0F6CBD] hover:bg-blue-50 font-bold text-xs cursor-pointer"
                      >
                        View Operations →
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B]">
          <span>
            Page {currentPage} of {totalPages} ({filteredExams.length} Total Records)
          </span>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="border-[#E2E8F0] text-xs cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="border-[#E2E8F0] text-xs cursor-pointer disabled:opacity-40"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecentCodingExamsTable;
