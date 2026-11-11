import React, { useState } from 'react';
import { EnterpriseLayout } from '@/lib/design-system/EnterpriseLayout';
import { Plus, Search, Filter, Shield, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamItem {
  id: number;
  title: string;
  department: string;
  participants: number;
  status: 'Active' | 'Upcoming' | 'Completed';
  duration: string;
  proctored: boolean;
}

const INITIAL_EXAMS: ExamItem[] = [
  { id: 1, title: 'Distributed Consensus & Raft Protocols', department: 'CS-402', participants: 482, status: 'Active', duration: '60 min', proctored: true },
  { id: 2, title: 'Clinical Pharmacology & Therapeutics', department: 'MED-801', participants: 310, status: 'Active', duration: '90 min', proctored: true },
  { id: 3, title: 'Digital Logic & Microprocessors', department: 'EE-304', participants: 290, status: 'Upcoming', duration: '120 min', proctored: true },
  { id: 4, title: 'Corporate Finance & Risk Analysis', department: 'FIN-601', participants: 400, status: 'Upcoming', duration: '45 min', proctored: true },
  { id: 5, title: 'Generative AI & LLM Architectures', department: 'AI-501', participants: 150, status: 'Completed', duration: '60 min', proctored: true },
];

export const Exams: React.FC = () => {
  const [exams] = useState<ExamItem[]>(INITIAL_EXAMS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = exams.filter(
    (e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <EnterpriseLayout>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0F172A', fontWeight: 800 }}>
            Institutional Examination Catalog & Blueprint Roster
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748B' }}>
            Author, schedule, and enforce AI proctoring policies across certification programs.
          </p>
        </div>

        <Link to="/proctoring" className="btn-enterprise-primary">
          <Plus size={16} /> Author New Examination
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="enterprise-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Filter by exam code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.4rem',
              fontSize: '0.85rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
          <span>Total Exams: <strong style={{ color: '#0F172A' }}>{exams.length}</strong></span>
          <span>•</span>
          <span>Proctored: <strong style={{ color: '#0F6CBD' }}>100%</strong></span>
        </div>
      </div>

      {/* Exam Catalog Table */}
      <div className="enterprise-card" style={{ padding: '1.5rem' }}>
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Examination Title</th>
              <th>Candidates</th>
              <th>Duration</th>
              <th>Proctoring Status</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam.id}>
                <td style={{ fontWeight: 700, color: '#0F6CBD' }}>{exam.department}</td>
                <td style={{ fontWeight: 600 }}>{exam.title}</td>
                <td style={{ fontWeight: 600 }}>{exam.participants} Registered</td>
                <td>{exam.duration}</td>
                <td>
                  <span className="badge-enterprise-info">
                    <Shield size={12} /> Zero-Trust AI Proctored
                  </span>
                </td>
                <td>
                  <span className={exam.status === 'Active' ? 'badge-enterprise-success' : exam.status === 'Upcoming' ? 'badge-enterprise-info' : 'badge-enterprise-warning'}>
                    {exam.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <Link to="/proctoring" style={{ color: '#0F6CBD', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                    Launch Suite →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EnterpriseLayout>
  );
};

export default Exams;
