import {
  DEFAULT_OBJECT_POLICY,
  OBJECT_ALTERNATIVE_INTERPRETATIONS,
  OBJECT_LIMITATIONS_EXPLANATIONS,
} from '../constants/object.constants';
import {
  DetectedObject,
  ObjectDetectionEvent,
  ObjectPolicyConfig,
  ObjectType,
  PolicyRule,
} from '../types/object.types';

/**
 * @class ObjectDetectionService
 * @description Enterprise Object Detection Engine providing frame analysis, bounding box generation,
 * configurable policy enforcement, alternative interpretations, and structured audit event generation.
 */
export class ObjectDetectionService {
  private static eventCounter = 0;

  /**
   * Determine policy rule (Allowed, Blocked, Warning, Ignored) for a given object type based on active policy config.
   */
  public evaluatePolicyRule(objectType: ObjectType, policyConfig: ObjectPolicyConfig = DEFAULT_OBJECT_POLICY): PolicyRule {
    if (policyConfig.blockedObjects.includes(objectType)) return 'Blocked';
    if (policyConfig.warningObjects.includes(objectType)) return 'Warning';
    if (policyConfig.allowedObjects.includes(objectType)) return 'Allowed';
    return 'Ignored';
  }

  /**
   * Generate mock object detections for demonstration / validation.
   */
  public analyzeFrame(
    videoElement?: HTMLVideoElement | null,
    policyConfig: ObjectPolicyConfig = DEFAULT_OBJECT_POLICY
  ): DetectedObject[] {
    // Baseline sample object detection (e.g. Mobile Phone)
    const phoneObj: DetectedObject = {
      trackingId: 'OBJ-101',
      objectType: 'Mobile Phone',
      confidenceScore: 88,
      confidenceRating: 'High',
      boundingBox: { x: 68, y: 55, width: 22, height: 32 },
      policyRule: this.evaluatePolicyRule('Mobile Phone', policyConfig),
      firstDetectedAt: new Date().toISOString(),
      durationMs: 4200,
      possibleAlternatives: OBJECT_ALTERNATIVE_INTERPRETATIONS['Mobile Phone'] || ['Wallet', 'Calculator'],
      explanation: 'A handheld rectangular electronic device consistent with a mobile phone was detected in the candidate frame.',
      limitations: OBJECT_LIMITATIONS_EXPLANATIONS.CONFUSION_MATRIX,
    };

    return [phoneObj];
  }

  /**
   * Helper to build structured object telemetry audit events.
   */
  public createObjectEvent(
    module: ObjectDetectionEvent['module'],
    objectType: ObjectType,
    event: ObjectDetectionEvent['event'],
    severity: ObjectDetectionEvent['severity'],
    confidence: ObjectDetectionEvent['confidence'],
    explanation: string,
    limitations: string,
    duration: number,
    trackingId: string,
    boundingBox: DetectedObject['boundingBox'],
    details: Record<string, any> = {}
  ): ObjectDetectionEvent {
    ObjectDetectionService.eventCounter++;
    return {
      id: `evt_obj_${Date.now()}_${ObjectDetectionService.eventCounter}`,
      timestamp: new Date().toISOString(),
      module,
      objectType,
      event,
      severity,
      confidence,
      explanation,
      limitations: limitations || OBJECT_LIMITATIONS_EXPLANATIONS.ANGLE_OCCLUSION,
      duration,
      trackingId,
      boundingBox,
      details,
    };
  }
}

export const objectDetectionService = new ObjectDetectionService();
