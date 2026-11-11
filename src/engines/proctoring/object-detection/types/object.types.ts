export type ObjectType =
  | 'Mobile Phone'
  | 'Tablet'
  | 'Smart Watch'
  | 'Calculator'
  | 'Book'
  | 'Notebook'
  | 'Printed Papers'
  | 'External Monitor'
  | 'Laptop'
  | 'USB Device'
  | 'Earphones'
  | 'Headphones'
  | 'Camera'
  | 'Webcam'
  | 'Keyboard'
  | 'Mouse'
  | 'Stylus'
  | 'Whiteboard'
  | 'ID Card';

export type PolicyRule = 'Allowed' | 'Blocked' | 'Warning' | 'Ignored';

export type DetectionConfidence = 'Low' | 'Medium' | 'High';

export interface BoundingBox {
  x: number; // 0..100 percentage
  y: number; // 0..100 percentage
  width: number; // 0..100 percentage
  height: number; // 0..100 percentage
}

export interface DetectedObject {
  trackingId: string; // e.g. "OBJ-101"
  objectType: ObjectType;
  confidenceScore: number; // 0..100
  confidenceRating: DetectionConfidence;
  boundingBox: BoundingBox;
  policyRule: PolicyRule;
  firstDetectedAt: string;
  durationMs: number;
  possibleAlternatives: string[]; // e.g. ["Wallet", "Calculator"]
  explanation: string;
  limitations: string;
}

export interface ObjectPolicyConfig {
  allowedObjects: ObjectType[];
  blockedObjects: ObjectType[];
  warningObjects: ObjectType[];
  ignoredObjects: ObjectType[];
  minConfidenceThreshold: number; // e.g. 60%
  minDurationAlertMs: number; // e.g. 2000ms
}

export interface ObjectDetectionEvent {
  id: string;
  timestamp: string;
  module: 'ObjectDetector' | 'ObjectTracker' | 'PhoneDetector' | 'BookDetector' | 'CalculatorDetector' | 'DisplayDetector';
  objectType: ObjectType;
  event: 'Detected' | 'Moved' | 'Removed' | 'PolicyViolation';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: DetectionConfidence;
  explanation: string;
  limitations: string;
  duration: number;
  trackingId: string;
  boundingBox: BoundingBox;
  details: Record<string, any>;
}

export interface ObjectDetectionState {
  isEngineActive: boolean;
  detectedObjects: DetectedObject[];
  events: ObjectDetectionEvent[];
  policyConfig: ObjectPolicyConfig;
  fps: number;
  isGpuAccelerated: boolean;
}
