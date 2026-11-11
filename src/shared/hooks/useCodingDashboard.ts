import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MetricCardData,
  CodingExamItem,
  ProblemRepoSummary,
  InfrastructureStatus,
  LanguageMetric,
  SubmissionAnalyticsData,
  CandidateActivityEvent,
  SystemServiceHealth,
  NotificationItem,
  TimelineActivityItem,
  DashboardFilterState,
} from '@/types/codingDashboard';

const INITIAL_METRICS: MetricCardData[] = [
  { id: 'total-exams', title: 'Total Coding Exams', value: 24, change: '+14%', isPositive: true, sparkline: [12, 14, 18, 20, 22, 24], iconName: 'BookOpen', category: 'exams' },
  { id: 'draft-exams', title: 'Draft Coding Exams', value: 5, change: '-2%', isPositive: true, sparkline: [8, 7, 6, 6, 5, 5], iconName: 'FileText', category: 'exams' },
  { id: 'published-exams', title: 'Published Coding Exams', value: 12, change: '+8%', isPositive: true, sparkline: [8, 9, 10, 11, 12, 12], iconName: 'CheckCircle', category: 'exams' },
  { id: 'running-exams', title: 'Running Coding Exams', value: 4, change: '+25%', isPositive: true, sparkline: [2, 3, 2, 4, 3, 4], iconName: 'PlayCircle', category: 'exams' },
  { id: 'completed-exams', title: 'Completed Coding Exams', value: 3, change: '+50%', isPositive: true, sparkline: [1, 1, 2, 2, 3, 3], iconName: 'Award', category: 'exams' },
  { id: 'coding-problems', title: 'Coding Problems', value: 148, change: '+18%', isPositive: true, sparkline: [100, 110, 125, 132, 140, 148], iconName: 'Code', category: 'exams' },
  { id: 'active-candidates', title: 'Active Candidates', value: 342, change: '+32%', isPositive: true, sparkline: [180, 220, 260, 300, 320, 342], iconName: 'Users', category: 'submissions' },
  { id: 'today-submissions', title: 'Today\'s Submissions', value: 1840, change: '+22%', isPositive: true, sparkline: [1200, 1400, 1550, 1680, 1750, 1840], iconName: 'Send', category: 'submissions' },
  { id: 'successful-executions', title: 'Successful Executions', value: '1,598', change: '+24%', isPositive: true, sparkline: [1000, 1200, 1350, 1480, 1520, 1598], iconName: 'Check', category: 'performance' },
  { id: 'compilation-errors', title: 'Compilation Errors', value: 182, change: '-6%', isPositive: true, sparkline: [240, 210, 200, 195, 188, 182], iconName: 'AlertTriangle', category: 'performance' },
  { id: 'avg-runtime', title: 'Average Runtime', value: '142 ms', change: '-12 ms', isPositive: true, sparkline: [180, 170, 160, 152, 148, 142], iconName: 'Clock', category: 'performance' },
  { id: 'avg-memory', title: 'Average Memory Usage', value: '28.4 MB', change: '-1.2 MB', isPositive: true, sparkline: [34, 32, 31, 30, 29, 28.4], iconName: 'Cpu', category: 'performance' },
  { id: 'success-rate', title: 'Execution Success Rate', value: '86.8%', change: '+3.4%', isPositive: true, sparkline: [80, 82, 83, 84, 85, 86.8], iconName: 'TrendingUp', category: 'performance' },
  { id: 'language-count', title: 'Language Count', value: 14, change: 'Supported', isPositive: true, sparkline: [14, 14, 14, 14, 14, 14], iconName: 'Terminal', category: 'infrastructure' },
  { id: 'judge-workers', title: 'Judge Workers Online', value: '16 / 16', change: '100% Online', isPositive: true, sparkline: [16, 16, 16, 16, 16, 16], iconName: 'Server', category: 'infrastructure' },
  { id: 'execution-queue', title: 'Execution Queue', value: '3 Pending', change: 'Optimal', isPositive: true, sparkline: [12, 8, 5, 4, 3, 3], iconName: 'Layers', category: 'infrastructure' },
];

const INITIAL_EXAMS: CodingExamItem[] = [
  {
    id: 'EX-COD-101',
    title: 'Senior Full Stack & Systems Architecture Coding Benchmark',
    organization: 'Massachusetts Institute of Technology',
    status: 'RUNNING',
    problemCount: 4,
    languages: ['Python', 'TypeScript', 'Go', 'Rust'],
    candidateCount: 142,
    submissionCount: 520,
    startTime: '2026-07-30 09:00',
    endTime: '2026-07-30 17:00',
    createdBy: 'Dr. Alex Vance',
  },
  {
    id: 'EX-COD-102',
    title: 'Algorithmic Data Structures & Graph Optimization Exam',
    organization: 'Stanford University School of Medicine',
    status: 'RUNNING',
    problemCount: 3,
    languages: ['C++', 'Java', 'Python'],
    candidateCount: 98,
    submissionCount: 412,
    startTime: '2026-07-30 10:00',
    endTime: '2026-07-30 16:00',
    createdBy: 'Prof. Sarah Jenkins',
  },
  {
    id: 'EX-COD-103',
    title: 'Distributed Systems & Microservices Concurrency Suite',
    organization: 'Pearson VUE Global Tech',
    status: 'PUBLISHED',
    problemCount: 5,
    languages: ['Go', 'Rust', 'Java', 'C#'],
    candidateCount: 65,
    submissionCount: 210,
    startTime: '2026-07-31 08:00',
    endTime: '2026-07-31 18:00',
    createdBy: 'David Kim (Lead Architect)',
  },
  {
    id: 'EX-COD-104',
    title: 'Database Schema Design & Complex SQL Optimization',
    organization: 'Harvard University Extension',
    status: 'DRAFT',
    problemCount: 6,
    languages: ['SQL', 'PostgreSQL'],
    candidateCount: 0,
    submissionCount: 0,
    startTime: '2026-08-05 09:00',
    endTime: '2026-08-05 15:00',
    createdBy: 'Elena Rostova',
  },
  {
    id: 'EX-COD-105',
    title: 'Mobile App Performance & Memory Management Evaluation',
    organization: 'Oracle Cloud Systems',
    status: 'COMPLETED',
    problemCount: 4,
    languages: ['Swift', 'Kotlin', 'Java'],
    candidateCount: 37,
    submissionCount: 698,
    startTime: '2026-07-28 09:00',
    endTime: '2026-07-28 17:00',
    createdBy: 'Marcus Wright',
  },
];

const INITIAL_PROBLEMS: ProblemRepoSummary = {
  totalProblems: 148,
  easy: 42,
  medium: 76,
  hard: 30,
  pendingReview: 8,
  approved: 132,
  archived: 8,
  recentlyUpdated: 14,
  growthRate: '+18.4% this month',
  topicDistribution: [
    { topic: 'Dynamic Programming', count: 32, percentage: 21.6 },
    { topic: 'Graph Theory & Trees', count: 28, percentage: 18.9 },
    { topic: 'Arrays & Hashing', count: 26, percentage: 17.5 },
    { topic: 'System Design & Concurrency', count: 22, percentage: 14.8 },
    { topic: 'String Algorithms', count: 20, percentage: 13.5 },
    { topic: 'SQL & Database Queries', count: 20, percentage: 13.5 },
  ],
};

const INITIAL_INFRASTRUCTURE: InfrastructureStatus = {
  judgeWorkersOnline: 16,
  totalJudgeWorkers: 16,
  queueLength: 3,
  runningContainers: 24,
  avgQueueTimeMs: 45,
  executionCapacityPercentage: 82,
  cpuUsagePercentage: 34.2,
  memoryUsagePercentage: 48.6,
  containerHealth: 'HEALTHY',
  workerHealth: 'HEALTHY',
  databaseStatus: 'HEALTHY',
  redisStatus: 'HEALTHY',
  webSocketStatus: 'HEALTHY',
};

const INITIAL_LANGUAGES: LanguageMetric[] = [
  { name: 'Python 3.12', code: 'python', usageCount: 420, executions: 5400, avgRuntimeMs: 110, avgMemoryMb: 24.2, successRate: 89.2, iconColor: '#3776AB' },
  { name: 'TypeScript 5.4', code: 'typescript', usageCount: 380, executions: 4800, avgRuntimeMs: 85, avgMemoryMb: 32.1, successRate: 91.5, iconColor: '#3178C6' },
  { name: 'C++ 20', code: 'cpp', usageCount: 310, executions: 4100, avgRuntimeMs: 12, avgMemoryMb: 8.4, successRate: 84.1, iconColor: '#00599C' },
  { name: 'Java 21', code: 'java', usageCount: 290, executions: 3800, avgRuntimeMs: 145, avgMemoryMb: 42.0, successRate: 86.4, iconColor: '#5382A1' },
  { name: 'Go 1.22', code: 'go', usageCount: 210, executions: 2900, avgRuntimeMs: 22, avgMemoryMb: 14.5, successRate: 94.0, iconColor: '#00ADD8' },
  { name: 'Rust 1.77', code: 'rust', usageCount: 180, executions: 2200, avgRuntimeMs: 15, avgMemoryMb: 9.1, successRate: 95.2, iconColor: '#000000' },
  { name: 'JavaScript (Node 20)', code: 'javascript', usageCount: 175, executions: 2100, avgRuntimeMs: 78, avgMemoryMb: 28.5, successRate: 88.0, iconColor: '#F7DF1E' },
  { name: 'C# .NET 8', code: 'csharp', usageCount: 140, executions: 1800, avgRuntimeMs: 95, avgMemoryMb: 35.0, successRate: 87.5, iconColor: '#239120' },
  { name: 'SQL (PostgreSQL)', code: 'sql', usageCount: 130, executions: 1600, avgRuntimeMs: 40, avgMemoryMb: 18.0, successRate: 92.1, iconColor: '#4169E1' },
  { name: 'Kotlin 1.9', code: 'kotlin', usageCount: 95, executions: 1100, avgRuntimeMs: 130, avgMemoryMb: 38.2, successRate: 85.0, iconColor: '#7F52FF' },
  { name: 'Swift 5.10', code: 'swift', usageCount: 80, executions: 950, avgRuntimeMs: 55, avgMemoryMb: 16.4, successRate: 90.1, iconColor: '#F05138' },
  { name: 'PHP 8.3', code: 'php', usageCount: 65, executions: 750, avgRuntimeMs: 90, avgMemoryMb: 22.0, successRate: 82.4, iconColor: '#777BB4' },
  { name: 'Ruby 3.3', code: 'ruby', usageCount: 50, executions: 600, avgRuntimeMs: 115, avgMemoryMb: 26.0, successRate: 84.0, iconColor: '#CC342D' },
  { name: 'C (GCC 13)', code: 'c', usageCount: 45, executions: 520, avgRuntimeMs: 8, avgMemoryMb: 4.2, successRate: 81.0, iconColor: '#A8B9CC' },
];

const INITIAL_SUBMISSIONS: SubmissionAnalyticsData = {
  accepted: 1598,
  wrongAnswer: 210,
  compilationError: 182,
  runtimeError: 94,
  timeLimitExceeded: 48,
  memoryLimitExceeded: 18,
  presentationError: 12,
  skipped: 15,
  pending: 3,
  totalSubmissions: 2180,
};

const INITIAL_ACTIVITIES: CandidateActivityEvent[] = [
  { id: 'act-1', candidateName: 'Eleanor Vance', candidateId: 'STU-8841', examTitle: 'Senior Full Stack & Systems Architecture', eventType: 'SUBMITTED', language: 'TypeScript', timestamp: 'Just now', details: 'Passed 18 / 18 Unit Tests' },
  { id: 'act-2', candidateName: 'Marcus Wright', candidateId: 'STU-9012', examTitle: 'Algorithmic Data Structures', eventType: 'EXECUTED', language: 'C++', timestamp: '1 min ago', details: 'Execution time: 14ms' },
  { id: 'act-3', candidateName: 'Sophia Martinez', candidateId: 'STU-7721', examTitle: 'Senior Full Stack & Systems Architecture', eventType: 'AUTO_SAVE', language: 'Python', timestamp: '2 mins ago', details: 'Code autosaved to persistent draft' },
  { id: 'act-4', candidateName: 'David Kim', candidateId: 'STU-4419', examTitle: 'Distributed Systems Concurrency', eventType: 'COMPILE_FAILED', language: 'Go', timestamp: '3 mins ago', details: 'Syntax error at line 42: undefined variable' },
  { id: 'act-5', candidateName: 'Aria Montgomery', candidateId: 'STU-1289', examTitle: 'Algorithmic Data Structures', eventType: 'STARTED', timestamp: '5 mins ago', details: 'Candidate authenticated & started assessment' },
  { id: 'act-6', candidateName: 'Liam O\'Connor', candidateId: 'STU-5520', examTitle: 'Senior Full Stack & Systems Architecture', eventType: 'LANG_CHANGED', language: 'Rust', timestamp: '7 mins ago', details: 'Switched environment from Python to Rust' },
];

const INITIAL_SYSTEM_HEALTH: SystemServiceHealth[] = [
  { name: 'API Gateway Health', serviceId: 'srv-api-gw', status: 'HEALTHY', uptime: '99.999%', latencyMs: 12, lastChecked: '10s ago' },
  { name: 'Judge Worker Cluster', serviceId: 'srv-judge-cluster', status: 'HEALTHY', uptime: '99.980%', latencyMs: 24, lastChecked: '5s ago' },
  { name: 'Polyglot Compiler Service', serviceId: 'srv-compiler', status: 'HEALTHY', uptime: '100.00%', latencyMs: 18, lastChecked: '8s ago' },
  { name: 'Sandbox Container Engine', serviceId: 'srv-container-engine', status: 'HEALTHY', uptime: '99.990%', latencyMs: 32, lastChecked: '4s ago' },
  { name: 'Storage & Artifact Vault', serviceId: 'srv-storage-vault', status: 'HEALTHY', uptime: '100.00%', latencyMs: 8, lastChecked: '12s ago' },
  { name: 'Redis Cache & Queue', serviceId: 'srv-redis-queue', status: 'HEALTHY', uptime: '99.999%', latencyMs: 2, lastChecked: '2s ago' },
  { name: 'PostgreSQL Primary DB', serviceId: 'srv-postgres-primary', status: 'HEALTHY', uptime: '99.995%', latencyMs: 5, lastChecked: '6s ago' },
  { name: 'Message Broker (NATS)', serviceId: 'srv-nats-broker', status: 'HEALTHY', uptime: '100.00%', latencyMs: 4, lastChecked: '3s ago' },
  { name: 'WASM Security Sentinel', serviceId: 'srv-wasm-sentinel', status: 'HEALTHY', uptime: '100.00%', latencyMs: 1, lastChecked: '1s ago' },
  { name: 'Telemetry & Audit Logger', serviceId: 'srv-telemetry-logger', status: 'HEALTHY', uptime: '99.990%', latencyMs: 7, lastChecked: '9s ago' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Judge Worker Cluster Scaled', message: '4 new judge containers provisioned dynamically to handle queue spike.', type: 'INFO', timestamp: '10 mins ago', read: false },
  { id: 'notif-2', title: 'Problem Approved', message: 'Problem #148 "Distributed Consensus Consensus Protocol" approved by Reviewer.', type: 'SUCCESS', timestamp: '25 mins ago', read: false },
  { id: 'notif-3', title: 'Exam Published', message: 'Exam "Senior Full Stack & Systems Architecture" published to 142 candidates.', type: 'SUCCESS', timestamp: '1 hour ago', read: true },
  { id: 'notif-4', title: 'Minor Compiler Spike Alert', message: 'GCC 13 compilation latency temporarily spiked to 140ms. Auto-resolved.', type: 'WARNING', timestamp: '2 hours ago', read: true },
];

const INITIAL_TIMELINE: TimelineActivityItem[] = [
  { id: 'tl-1', actor: 'Dr. Alex Vance', action: 'Published Coding Exam', target: 'Senior Full Stack & Systems Architecture Benchmark', timestamp: '1 hour ago', category: 'EXAM' },
  { id: 'tl-2', actor: 'Reviewer Team', action: 'Approved Problem', target: 'Graph Optimization & Shortest Path (Hard)', timestamp: '2 hours ago', category: 'PROBLEM' },
  { id: 'tl-3', actor: 'System Worker #04', action: 'Completed Sandbox Batch', target: '120 Candidate Submissions Executed', timestamp: '3 hours ago', category: 'INFRASTRUCTURE' },
  { id: 'tl-4', actor: 'Candidate STU-8841', action: 'Submitted Final Code', target: 'Passed All 18 Test Cases (100% Score)', timestamp: '4 hours ago', category: 'SUBMISSION' },
  { id: 'tl-5', actor: 'Ops Engineer', action: 'Updated Container Limits', target: 'Increased Memory Ceiling to 512MB per Sandbox', timestamp: '5 hours ago', category: 'INFRASTRUCTURE' },
];

// Custom Hooks
export const useCodingMetrics = () => {
  return useQuery<MetricCardData[]>({
    queryKey: ['coding-metrics'],
    queryFn: async () => INITIAL_METRICS,
    staleTime: 15000,
  });
};

export const useCodingExams = (filterState?: DashboardFilterState) => {
  return useQuery<CodingExamItem[]>({
    queryKey: ['coding-exams', filterState],
    queryFn: async () => {
      let exams = [...INITIAL_EXAMS];
      if (filterState?.searchQuery) {
        const q = filterState.searchQuery.toLowerCase();
        exams = exams.filter(e => e.title.toLowerCase().includes(q) || e.organization.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
      }
      if (filterState?.organization && filterState.organization !== 'ALL') {
        exams = exams.filter(e => e.organization === filterState.organization);
      }
      if (filterState?.examStatus && filterState.examStatus !== 'ALL') {
        exams = exams.filter(e => e.status === filterState.examStatus);
      }
      return exams;
    },
    staleTime: 15000,
  });
};

export const useProblemRepo = () => {
  return useQuery<ProblemRepoSummary>({
    queryKey: ['coding-problem-repo'],
    queryFn: async () => INITIAL_PROBLEMS,
    staleTime: 15000,
  });
};

export const useExecutionInfrastructure = () => {
  return useQuery<InfrastructureStatus>({
    queryKey: ['coding-infrastructure'],
    queryFn: async () => INITIAL_INFRASTRUCTURE,
    staleTime: 10000,
  });
};

export const useLanguageDistribution = () => {
  return useQuery<LanguageMetric[]>({
    queryKey: ['coding-languages'],
    queryFn: async () => INITIAL_LANGUAGES,
    staleTime: 30000,
  });
};

export const useSubmissionAnalytics = () => {
  return useQuery<SubmissionAnalyticsData>({
    queryKey: ['coding-submissions-analytics'],
    queryFn: async () => INITIAL_SUBMISSIONS,
    staleTime: 15000,
  });
};

export const useCandidateActivity = () => {
  return useQuery<CandidateActivityEvent[]>({
    queryKey: ['coding-candidate-activity'],
    queryFn: async () => INITIAL_ACTIVITIES,
    staleTime: 5000,
  });
};

export const useSystemHealth = () => {
  return useQuery<SystemServiceHealth[]>({
    queryKey: ['coding-system-health'],
    queryFn: async () => INITIAL_SYSTEM_HEALTH,
    staleTime: 10000,
  });
};

export const useCodingNotifications = () => {
  return useQuery<NotificationItem[]>({
    queryKey: ['coding-notifications'],
    queryFn: async () => INITIAL_NOTIFICATIONS,
    staleTime: 15000,
  });
};

export const useCodingTimeline = () => {
  return useQuery<TimelineActivityItem[]>({
    queryKey: ['coding-timeline'],
    queryFn: async () => INITIAL_TIMELINE,
    staleTime: 15000,
  });
};
