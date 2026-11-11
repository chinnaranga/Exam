import React, { useState } from 'react';
import { EnterpriseLayout } from '@/shared/components/EnterpriseLayout';
import { ConsentManager } from '@/engines/proctoring/consent/ConsentManager';
import { CameraManager } from '@/engines/proctoring/camera/CameraManager';
import { FaceEngine } from '@/engines/proctoring/face/FaceEngine';
import { AttentionEngine } from '@/engines/proctoring/attention/AttentionEngine';
import { ObjectDetectionEngine } from '@/engines/proctoring/object-detection/ObjectDetectionEngine';
import { AudioEngine } from '@/engines/proctoring/audio/AudioEngine';
import { PipelineEngine } from '@/engines/proctoring/pipeline/PipelineEngine';
import { PreExamPermissionModal } from '@/engines/proctoring/consent/PreExamPermissionModal';
import { EnterpriseCommandCenter } from '@/modules/enterprise-operations/EnterpriseCommandCenter';
import { Link } from 'react-router-dom';
import { ShieldCheck, Play, ArrowLeft } from 'lucide-react';

export const ProctoringSuitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'permission' | 'module1' | 'module2' | 'module3' | 'module4' | 'module5' | 'module6' | 'module7' | 'operations'>('flow');
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);

  const startLiveExam = () => {
    setIsExamRunning(true);
  };

  const exitLiveExam = () => {
    setIsExamRunning(false);
  };

  return (
    <EnterpriseLayout hideHeaderFooter={isExamRunning}>
      {/* Live Examination Workspace (Header/Footer Hidden) */}
      {isExamRunning ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
            <div>
              <span className="badge-enterprise-success" style={{ marginBottom: '0.35rem' }}>● LIVE PROCTORED SESSION</span>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0F172A', fontWeight: 800 }}>
                Question 1 of 40: Time Complexity Analysis
              </h2>
            </div>

            <button type="button" onClick={exitLiveExam} className="btn-enterprise-secondary" style={{ fontSize: '0.85rem' }}>
              <ArrowLeft size={16} /> Exit Exam & Restore Header
            </button>
          </div>

          {/* Active AI Proctoring Engine Container */}
          <div style={{ marginBottom: '1.5rem' }}>
            <PipelineEngine />
          </div>

          <div style={{ textAlign: 'right', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
            <button type="button" onClick={() => alert('Exam submitted successfully!')} className="btn-enterprise-primary" style={{ backgroundColor: '#16A34A' }}>
              Submit Exam Answers & Finish →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0F172A', fontWeight: 800 }}>AssessIQ AI Proctoring System Suite</h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748B' }}>
                Production-Ready AI Proctoring Architecture • Modules 1 through 7 + Phase 6 Enterprise Operations
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setActiveTab('permission')} className="btn-enterprise-primary">
                <Play size={16} /> Start Secured Exam Mode
              </button>
              <Link to="/admin/operations" className="btn-enterprise-secondary">
                Command Center →
              </Link>
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'flow', label: '1. Guided Setup (Modules 1 → 7)' },
              { id: 'permission', label: 'Mandatory Permission Check' },
              { id: 'module1', label: 'Module 1: Consent' },
              { id: 'module2', label: 'Module 2: Camera' },
              { id: 'module3', label: 'Module 3: Face' },
              { id: 'module4', label: 'Module 4: Attention' },
              { id: 'module5', label: 'Module 5: Object' },
              { id: 'module6', label: 'Module 6: Audio' },
              { id: 'module7', label: 'Module 7: Pipeline Engine' },
              { id: 'operations', label: 'Phase 6: Operations (20 Modules)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  border: activeTab === tab.id ? '1px solid #0F6CBD' : '1px solid #CBD5E1',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === tab.id ? '#0F6CBD' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                  boxShadow: activeTab === tab.id ? '0 2px 4px rgba(15, 108, 189, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 200ms ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}

          {/* Permission Verification Step */}
          {activeTab === 'permission' && (
            <PreExamPermissionModal onPermissionsGranted={startLiveExam} />
          )}

          {/* 1. Guided Setup Flow */}
          {activeTab === 'flow' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <h2 style={{ marginTop: 0, color: '#0F6CBD' }}>Candidate Pre-Exam Setup Flow</h2>
              <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
                Flowing through <strong>Consent Manager</strong> → <strong>Camera Manager</strong> → <strong>Face Engine</strong> → <strong>Attention Engine</strong> → <strong>Object Engine</strong> → <strong>Audio Engine</strong> → <strong>Pipeline Engine</strong>.
              </p>

              <ConsentManager onProceedToNextPhase={() => setActiveTab('permission')} />
            </div>
          )}

          {/* Module 1 Standalone */}
          {activeTab === 'module1' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <ConsentManager onProceedToNextPhase={() => setActiveTab('module2')} />
            </div>
          )}

          {/* Module 2 Standalone */}
          {activeTab === 'module2' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <CameraManager autoStart={true} onProceedToModule3={() => setActiveTab('module3')} />
            </div>
          )}

          {/* Module 3 Standalone */}
          {activeTab === 'module3' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <FaceEngine autoStart={true} onProceedToModule4={() => setActiveTab('module4')} />
            </div>
          )}

          {/* Module 4 Standalone */}
          {activeTab === 'module4' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <AttentionEngine autoStart={true} onProceedToModule5={() => setActiveTab('module5')} />
            </div>
          )}

          {/* Module 5 Standalone */}
          {activeTab === 'module5' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <ObjectDetectionEngine autoStart={true} onProceedToModule6={() => setActiveTab('module6')} />
            </div>
          )}

          {/* Module 6 Standalone */}
          {activeTab === 'module6' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <AudioEngine autoStart={true} onProceedToModule7={() => setActiveTab('module7')} />
            </div>
          )}

          {/* Module 7 Standalone */}
          {activeTab === 'module7' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <PipelineEngine onProceedToModule8={() => alert('Module 8 (Invigilator & Reviewer Command Center) will follow!')} />
            </div>
          )}

          {/* Operations Standalone */}
          {activeTab === 'operations' && (
            <div className="enterprise-card" style={{ padding: '2rem' }}>
              <EnterpriseCommandCenter />
            </div>
          )}
        </>
      )}
    </EnterpriseLayout>
  );
};

export default ProctoringSuitePage;
