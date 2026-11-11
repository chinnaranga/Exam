import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PipelineAlert,
  PipelinePolicyConfig,
  RiskDimensionScore,
  SessionState,
  UnifiedIntegrityEvent,
} from '@/server/confidence-pipeline/types/pipeline.types';
import { DEFAULT_PIPELINE_POLICY } from '@/server/confidence-pipeline/constants/pipeline.constants';
import { eventGatewayService } from '@/server/confidence-pipeline/services/eventGateway.service';
import { sessionStateManagerService } from '@/server/confidence-pipeline/services/sessionStateManager.service';
import { policyEngineService } from '@/server/confidence-pipeline/services/policyEngine.service';

export interface PipelineContextValue {
  sessionState: SessionState;
  events: UnifiedIntegrityEvent[];
  alerts: PipelineAlert[];
  policyConfig: PipelinePolicyConfig;
  ingestEvent: (event: Partial<UnifiedIntegrityEvent>) => void;
  updatePolicy: (newConfig: Partial<PipelinePolicyConfig>) => void;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

export interface PipelineProviderProps {
  children: React.ReactNode;
  sessionId?: string;
}

export const PipelineProvider: React.FC<PipelineProviderProps> = ({ children, sessionId = 'sess_default_2026' }) => {
  const [sessionState, setSessionState] = useState<SessionState>(sessionStateManagerService.getSessionState(sessionId));
  const [events, setEvents] = useState<UnifiedIntegrityEvent[]>([]);
  const [alerts, setAlerts] = useState<PipelineAlert[]>([]);
  const [policyConfig, setPolicyConfig] = useState<PipelinePolicyConfig>(policyEngineService.getPolicy());

  const ingestEvent = (raw: Partial<UnifiedIntegrityEvent>) => {
    try {
      const res = eventGatewayService.processIngestedEvent({ ...raw, sessionId });
      setEvents((prev) => [res.event, ...prev.slice(0, 49)]);
      if (res.alert) {
        setAlerts((prev) => [res.alert!, ...prev.slice(0, 19)]);
      }
      setSessionState(sessionStateManagerService.getSessionState(sessionId));
    } catch (err) {
      console.error('Pipeline ingestion error:', err);
    }
  };

  const updatePolicy = (newConfig: Partial<PipelinePolicyConfig>) => {
    const updated = policyEngineService.updatePolicy(newConfig);
    setPolicyConfig(updated);
  };

  const value: PipelineContextValue = {
    sessionState,
    events,
    alerts,
    policyConfig,
    ingestEvent,
    updatePolicy,
  };

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>;
};

export const usePipelineContext = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipelineContext must be used within a PipelineProvider');
  }
  return context;
};
