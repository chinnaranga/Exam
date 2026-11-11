import { DetectedObject } from '../types/object.types';

/**
 * @class ObjectTrackingService
 * @description Persistent Object Tracker assigning unique IDs (OBJ-101, OBJ-102) across video frames
 * and managing object movement, duration, appearance, and disappearance lifecycle.
 */
export class ObjectTrackingService {
  private idCounter = 100;
  private activeTrackerMap = new Map<string, DetectedObject>();

  public getNextTrackingId(): string {
    this.idCounter++;
    return `OBJ-${this.idCounter}`;
  }

  /**
   * Update tracked objects across frames and update active durations.
   */
  public updateTracks(currentDetections: DetectedObject[], deltaMs: number): DetectedObject[] {
    return currentDetections.map((det) => {
      const existing = this.activeTrackerMap.get(det.trackingId);
      const newDuration = (existing ? existing.durationMs : 0) + deltaMs;
      const updated = {
        ...det,
        durationMs: newDuration,
      };
      this.activeTrackerMap.set(det.trackingId, updated);
      return updated;
    });
  }

  public clearTrackers() {
    this.activeTrackerMap.clear();
  }
}

export const objectTrackingService = new ObjectTrackingService();
