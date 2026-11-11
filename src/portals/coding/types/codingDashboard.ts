export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  sparkline: number[];
  iconName: string;
  category: 'exams' | 'submissions' | 'performance' | 'infrastructure';
}

export interface CodingExamItem {
  id: string;
  title: string;
  organization: string;
  status: 'DRAFT' | 'PUBLISHED' | 'RUNNING' | 'COMPLETED';
  problemCount: number;
  languages: string[];
  candidateCount: number;
  submissionCount: number;
  startTime: string;
  endTime: string;
  createdBy: string;
}

export interface ProblemRepoSummary {
  totalProblems: number;
  easy: number;
  medium: number;
  hard: number;
  pendingReview: number;
  approved: number;
  archived: number;
  recentlyUpdated: number;
  growthRate: string;
  topicDistribution: { topic: string; count: number; percentage: number }[];
}

export interface InfrastructureStatus {
  judgeWorkersOnline: number;
  totalJudgeWorkers: number;
  queueLength: number;
  runningContainers: number;
  avgQueueTimeMs: number;
  executionCapacityPercentage: number;
  cpuUsagePercentage: number;
  memoryUsagePercentage: number;
  containerHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  workerHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  databaseStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  redisStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  webSocketStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface LanguageMetric {
  name: string;
  code: string;
  usageCount: number;
  executions: number;
  avgRuntimeMs: number;
  avgMemoryMb: number;
  successRate: number;
  iconColor: string;
}

export interface SubmissionAnalyticsData {
  accepted: number;
  wrongAnswer: number;
  compilationError: number;
  runtimeError: number;
  timeLimitExceeded: number;
  memoryLimitExceeded: number;
  presentationError: number;
  skipped: number;
  pending: number;
  totalSubmissions: number;
}

export interface CandidateActivityEvent {
  id: string;
  candidateName: string;
  candidateId: string;
  examTitle: string;
  eventType:
    | 'STARTED'
    | 'EXECUTED'
    | 'SUBMITTED'
    | 'COMPILE_FAILED'
    | 'COMPLETED'
    | 'EXAM_SUBMITTED'
    | 'AUTO_SAVE'
    | 'LANG_CHANGED';
  language?: string;
  timestamp: string;
  details?: string;
}

export interface SystemServiceHealth {
  name: string;
  serviceId: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  uptime: string;
  latencyMs: number;
  lastChecked: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  timestamp: string;
  read: boolean;
}

export interface TimelineActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  category: 'EXAM' | 'PROBLEM' | 'SUBMISSION' | 'INFRASTRUCTURE' | 'CANDIDATE';
}

export interface DashboardFilterState {
  searchQuery: string;
  organization: string;
  language: string;
  difficulty: string;
  examStatus: string;
  timeRange: '24h' | '7d' | '30d' | 'all';
}
