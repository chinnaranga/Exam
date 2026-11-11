export interface DeviceRecord {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceName: string;
  deviceType: string;
  osName: string;
  browserName: string;
  isTrusted: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

const devicesMemoryStore = new Map<string, DeviceRecord>();

export class DeviceService {
  /**
   * Register or update user device fingerprint
   */
  public static async registerDevice(input: {
    userId: string;
    deviceFingerprint: string;
    deviceName?: string;
    deviceType?: string;
    osName?: string;
    browserName?: string;
  }): Promise<DeviceRecord> {
    const existingKey = `${input.userId}:${input.deviceFingerprint}`;
    const existing = devicesMemoryStore.get(existingKey);

    if (existing) {
      existing.lastUsedAt = new Date();
      return existing;
    }

    const newDevice: DeviceRecord = {
      id: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: input.userId,
      deviceFingerprint: input.deviceFingerprint,
      deviceName: input.deviceName || 'MacBook Pro',
      deviceType: input.deviceType || 'DESKTOP_MAC',
      osName: input.osName || 'macOS',
      browserName: input.browserName || 'Chrome',
      isTrusted: false,
      lastUsedAt: new Date(),
      createdAt: new Date(),
    };

    devicesMemoryStore.set(existingKey, newDevice);
    return newDevice;
  }

  /**
   * Get all registered devices for user
   */
  public static async getUserDevices(userId: string): Promise<DeviceRecord[]> {
    return Array.from(devicesMemoryStore.values()).filter((d) => d.userId === userId);
  }

  /**
   * Set device trust status
   */
  public static async setDeviceTrust(deviceId: string, isTrusted: boolean): Promise<boolean> {
    for (const dev of devicesMemoryStore.values()) {
      if (dev.id === deviceId) {
        dev.isTrusted = isTrusted;
        return true;
      }
    }
    return false;
  }

  /**
   * Remove registered device
   */
  public static async removeDevice(deviceId: string): Promise<boolean> {
    for (const [key, dev] of devicesMemoryStore.entries()) {
      if (dev.id === deviceId) {
        devicesMemoryStore.delete(key);
        return true;
      }
    }
    return false;
  }
}
