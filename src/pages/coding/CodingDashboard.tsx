import React, { useState } from 'react';
import {
  useCodingMetrics,
  useCodingExams,
  useProblemRepo,
  useExecutionInfrastructure,
  useLanguageDistribution,
  useSubmissionAnalytics,
  useCandidateActivity,
  useSystemHealth,
  useCodingNotifications,
  useCodingTimeline,
} from '@/hooks/useCodingDashboard';
import { DashboardFilterState } from '@/types/codingDashboard';
import { CodingDashboardHeader } from '@/components/coding/CodingDashboardHeader';
import { ExecutiveMetricsGrid } from '@/components/coding/ExecutiveMetricsGrid';
import { ExecutionOverviewSection } from '@/components/coding/ExecutionOverviewSection';
import { RecentCodingExamsTable } from '@/components/coding/RecentCodingExamsTable';
import { ProblemRepositoryOverview } from '@/components/coding/ProblemRepositoryOverview';
import { ExecutionInfrastructureCard } from '@/components/coding/ExecutionInfrastructureCard';
import { LanguageDistributionGrid } from '@/components/coding/LanguageDistributionGrid';
import { SubmissionAnalyticsSection } from '@/components/coding/SubmissionAnalyticsSection';
import { CandidateActivityStream } from '@/components/coding/CandidateActivityStream';
import { SystemHealthMatrix } from '@/components/coding/SystemHealthMatrix';
import { QuickActionsGrid } from '@/components/coding/QuickActionsGrid';
import { RecentNotificationsPanel } from '@/components/coding/RecentNotificationsPanel';
import { RecentActivityTimeline } from '@/components/coding/RecentActivityTimeline';
import { GlobalSearchFilterBar } from '@/components/coding/GlobalSearchFilterBar';
import { CodingModals } from '@/components/coding/CodingModals';
import { toast } from 'sonner';

export const CodingDashboard: React.FC = () => {
  // Modal Trigger States
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isCreateProblemOpen, setIsCreateProblemOpen] = useState(false);
  const [isImportProblemsOpen, setIsImportProblemsOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Global Search & Filter State
  const [filterState, setFilterState] = useState<DashboardFilterState>({
    searchQuery: '',
    organization: 'ALL',
    language: 'ALL',
    difficulty: 'ALL',
    examStatus: 'ALL',
    timeRange: '24h',
  });

  // Query Hooks
  const { data: metrics, isLoading: isMetricsLoading, refetch: refetchMetrics } = useCodingMetrics();
  const { data: exams, isLoading: isExamsLoading, refetch: refetchExams } = useCodingExams(filterState);
  const { data: repoSummary, isLoading: isRepoLoading, refetch: refetchRepo } = useProblemRepo();
  const { data: infra, isLoading: isInfraLoading, refetch: refetchInfra } = useExecutionInfrastructure();
  const { data: languages, isLoading: isLanguagesLoading, refetch: refetchLanguages } = useLanguageDistribution();
  const { data: submissionAnalytics, isLoading: isSubmissionLoading, refetch: refetchSubmissions } = useSubmissionAnalytics();
  const { data: candidateActivities, isLoading: isActivitiesLoading, refetch: refetchActivities } = useCandidateActivity();
  const { data: systemHealth, isLoading: isHealthLoading, refetch: refetchHealth } = useSystemHealth();
  const { data: notifications, isLoading: isNotificationsLoading, refetch: refetchNotifications } = useCodingNotifications();
  const { data: timeline, isLoading: isTimelineLoading, refetch: refetchTimeline } = useCodingTimeline();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing coding telemetry & execution streams...');
    await Promise.all([
      refetchMetrics(),
      refetchExams(),
      refetchRepo(),
      refetchInfra(),
      refetchLanguages(),
      refetchSubmissions(),
      refetchActivities(),
      refetchHealth(),
      refetchNotifications(),
      refetchTimeline(),
    ]);
    setIsRefreshing(false);
    toast.success('Telemetry refetched successfully!');
  };

  const handleFilterChange = (newState: Partial<DashboardFilterState>) => {
    setFilterState(prev => ({ ...prev, ...newState }));
  };

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      organization: 'ALL',
      language: 'ALL',
      difficulty: 'ALL',
      examStatus: 'ALL',
      timeRange: '24h',
    });
    toast.info('Reset global dashboard search and filters.');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2 sm:p-4 font-sans text-[#0F172A]">
      {/* Header */}
      <CodingDashboardHeader
        onOpenCreateExam={() => setIsCreateExamOpen(true)}
        onOpenCreateProblem={() => setIsCreateProblemOpen(true)}
        onOpenImportProblems={() => setIsImportProblemsOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Global Search & Filter Bar */}
      <GlobalSearchFilterBar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* SECTION 1: Executive Metrics */}
      {metrics && <ExecutiveMetricsGrid metrics={metrics} isLoading={isMetricsLoading} />}

      {/* SECTION 2: Execution Overview */}
      <ExecutionOverviewSection />

      {/* SECTION 3: Recent Coding Exams */}
      {exams && <RecentCodingExamsTable exams={exams} isLoading={isExamsLoading} />}

      {/* SECTION 4: Problem Repository Overview */}
      {repoSummary && <ProblemRepositoryOverview repoSummary={repoSummary} isLoading={isRepoLoading} />}

      {/* SECTION 5: Execution Infrastructure */}
      {infra && <ExecutionInfrastructureCard infra={infra} isLoading={isInfraLoading} />}

      {/* SECTION 6: Language Distribution */}
      {languages && <LanguageDistributionGrid languages={languages} isLoading={isLanguagesLoading} />}

      {/* SECTION 7: Submission Analytics */}
      {submissionAnalytics && (
        <SubmissionAnalyticsSection analytics={submissionAnalytics} isLoading={isSubmissionLoading} />
      )}

      {/* Grid for SECTION 8 (Candidate Activity) & SECTION 9 (System Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {candidateActivities && (
          <CandidateActivityStream activities={candidateActivities} isLoading={isActivitiesLoading} />
        )}
        {systemHealth && (
          <SystemHealthMatrix services={systemHealth} isLoading={isHealthLoading} />
        )}
      </div>

      {/* SECTION 10: Quick Actions */}
      <QuickActionsGrid
        onOpenCreateExam={() => setIsCreateExamOpen(true)}
        onOpenCreateProblem={() => setIsCreateProblemOpen(true)}
        onOpenImportProblems={() => setIsImportProblemsOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
      />

      {/* Grid for SECTION 11 (Notifications) & SECTION 12 (Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {notifications && (
          <RecentNotificationsPanel notifications={notifications} isLoading={isNotificationsLoading} />
        )}
        {timeline && (
          <RecentActivityTimeline timeline={timeline} isLoading={isTimelineLoading} />
        )}
      </div>

      {/* Interactive Modals */}
      <CodingModals
        isCreateExamOpen={isCreateExamOpen}
        onCloseCreateExam={() => setIsCreateExamOpen(false)}
        isCreateProblemOpen={isCreateProblemOpen}
        onCloseCreateProblem={() => setIsCreateProblemOpen(false)}
        isImportProblemsOpen={isImportProblemsOpen}
        onCloseImportProblems={() => setIsImportProblemsOpen(false)}
        isSandboxOpen={isSandboxOpen}
        onCloseSandbox={() => setIsSandboxOpen(false)}
      />
    </div>
  );
};

export default CodingDashboard;
