import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, PaginatedResponse, QueryParams } from "@/shared/lib/apiClient";

export interface ExamRecord {
  id: string;
  title: string;
  code: string;
  durationMinutes: number;
  totalQuestions: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledStartTime: string;
}

export interface CandidateRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  department: string;
  status: string;
}

export interface QuestionRecord {
  id: string;
  section: string;
  text: string;
  options: string[];
  correctOption: number;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  action: string;
  userEmail: string;
  ipAddress: string;
  details: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  code: string;
  tenantId: string;
}

// React Query Hooks
export const useExams = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<ExamRecord>>({
    queryKey: ['exams', params],
    queryFn: async () => {
      try {
        return await apiClient.get<PaginatedResponse<ExamRecord>>('/exams', params);
      } catch {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
    },
    staleTime: 30000,
  });
};

export const useCandidates = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<CandidateRecord>>({
    queryKey: ['candidates', params],
    queryFn: async () => {
      try {
        return await apiClient.get<PaginatedResponse<CandidateRecord>>('/candidates', params);
      } catch {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
    },
    staleTime: 30000,
  });
};

export const useQuestionBank = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<QuestionRecord>>({
    queryKey: ['questions', params],
    queryFn: async () => {
      try {
        return await apiClient.get<PaginatedResponse<QuestionRecord>>('/questions', params);
      } catch {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
    },
    staleTime: 30000,
  });
};

export const useAuditLogs = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<AuditLogRecord>>({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      try {
        return await apiClient.get<PaginatedResponse<AuditLogRecord>>('/audit-logs', params);
      } catch {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
    },
    staleTime: 15000,
  });
};

export const useOrganizations = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<OrganizationRecord>>({
    queryKey: ['organizations', params],
    queryFn: async () => {
      try {
        return await apiClient.get<PaginatedResponse<OrganizationRecord>>('/organizations', params);
      } catch {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
    },
    staleTime: 60000,
  });
};
