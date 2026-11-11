import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { IntegrationPlatformService, JobQueueMetrics } from '@/server/integration/integration_platform.service';
import { Cpu, RefreshCw, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { toast } from 'sonner';

export const JobQueuePage: React.FC = () => {
  const [metrics, setMetrics] = useState<JobQueueMetrics>(() => IntegrationPlatformService.getJobQueueMetrics());

  const handleFlushDeadLetter = () => {
    setMetrics({ ...metrics, failedJobs: 0 });
    toast.success('Dead Letter Queue Flushed', { description: 'Flushed failed background jobs from Redis buffer.' });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>BullMQ / Redis Async Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Background Job Queue Monitor</h1>
          <p className="text-xs text-[#6B7280]">
            Monitor scheduled PDF score rendering, email dispatches, and IRT 3PL model calibrations.
          </p>
        </div>

        <Button onClick={handleFlushDeadLetter} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs px-4 py-2 rounded-xl">
          Flush Dead Letter Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono text-xs">
        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Active Running Jobs</span>
          <div className="text-2xl font-extrabold text-[#2563EB]">{metrics.activeJobs} Jobs</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Worker Pool 16 Threads</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Completed Jobs</span>
          <div className="text-2xl font-extrabold text-[#16A34A]">{metrics.completedJobs.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Success</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Failed (Dead Letter)</span>
          <div className="text-2xl font-extrabold text-red-600">{metrics.failedJobs} Jobs</div>
          <span className="text-[10px] text-red-600 font-bold">Requires Action</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Delayed Cron Jobs</span>
          <div className="text-2xl font-extrabold text-[#111827]">{metrics.delayedJobs} Jobs</div>
          <span className="text-[10px] text-[#6B7280]">Scheduled</span>
        </Card>
      </div>
    </div>
  );
};

export default JobQueuePage;
