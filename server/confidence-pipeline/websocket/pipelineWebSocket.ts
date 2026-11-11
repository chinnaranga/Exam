import { Server as SocketIOServer } from 'socket.io';
import { UnifiedIntegrityEvent, PipelineAlert, RiskDimensionScore } from './types/pipeline.types';

export class PipelineWebSocketPublisher {
  private io: SocketIOServer | null = null;

  public initialize(io: SocketIOServer) {
    this.io = io;
  }

  public publishNewIntegrityEvent(event: UnifiedIntegrityEvent) {
    if (this.io) {
      this.io.emit('NewIntegrityEvent', event);
    }
  }

  public publishAlertCreated(alert: PipelineAlert) {
    if (this.io) {
      this.io.emit('AlertCreated', alert);
    }
  }

  public publishRiskDimensionUpdated(riskDimensions: RiskDimensionScore[]) {
    if (this.io) {
      this.io.emit('RiskDimensionUpdated', riskDimensions);
    }
  }

  public publishSessionUpdated(sessionData: any) {
    if (this.io) {
      this.io.emit('SessionUpdated', sessionData);
    }
  }
}

export const pipelineWebSocketPublisher = new PipelineWebSocketPublisher();
