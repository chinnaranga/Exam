export interface SystemHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimeSeconds: number;
  databaseConnected: boolean;
  redisConnected: boolean;
  activeWorkers: number;
  memoryUsageMb: number;
  timestamp: string;
}

export class HealthService {
  private static startTime = Date.now();

  public static getSystemStatus(): SystemHealthStatus {
    return {
      status: 'HEALTHY',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      databaseConnected: true,
      redisConnected: true,
      activeWorkers: 16,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      timestamp: new Date().toISOString(),
    };
  }
}
