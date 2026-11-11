import { ObjectPolicyConfig } from '../types/object.types';

export const DEFAULT_OBJECT_POLICY: ObjectPolicyConfig = {
  allowedObjects: ['ID Card', 'Webcam', 'Keyboard', 'Mouse'],
  blockedObjects: ['Mobile Phone', 'Tablet', 'Smart Watch', 'Book', 'Printed Papers', 'External Monitor', 'Earphones', 'Headphones'],
  warningObjects: ['Calculator', 'Notebook', 'Stylus', 'USB Device'],
  ignoredObjects: ['Whiteboard'],
  minConfidenceThreshold: 65,
  minDurationAlertMs: 2000,
};

export const OBJECT_ALTERNATIVE_INTERPRETATIONS: Record<string, string[]> = {
  'Mobile Phone': ['Wallet', 'Scientific Calculator', 'Small Notepad', 'Power Bank'],
  Calculator: ['Mobile Phone', 'Basic Remote', 'Audio Recorder'],
  Book: ['Open Folder', 'Textbook', 'Clipboard', 'Large Notepad'],
  'Smart Watch': ['Fitness Band', 'Analog Wristwatch', 'Medical Monitor'],
  Earphones: ['Hearing Aid', 'Earplugs', 'Jewelry / Earring'],
  'External Monitor': ['Secondary Laptop Screen', 'Desktop Display', 'Mounted Tablet'],
};

export const OBJECT_LIMITATIONS_EXPLANATIONS = {
  ANGLE_OCCLUSION: 'Object classification accuracy depends on lighting, viewing angle, and partial hand occlusion.',
  CONFUSION_MATRIX: 'Rectangular handheld items (phones/wallets/calculators) share similar geometric profiles.',
  CAMERA_DISTANCE: 'Small accessories (earbuds/smartwatches) require high webcam resolution for definitive classification.',
};
