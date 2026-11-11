export const ATTENTION_CONFIG = {
  INFERENCE_TARGET_FPS: 8,
  INFERENCE_INTERVAL_MS: 125,
  GAZE_THRESHOLD_DEG: 18, // Angles beyond 18° classify as looking left/right/up/down
  HEAD_POSE_THRESHOLD_DEG: 22,
  LONG_EYE_CLOSURE_MS: 2500, // 2.5 seconds
  LOOKING_AWAY_ALERT_MS: 4000,
  LONG_LOOKING_AWAY_MS: 12000,
};

export const NON_PREJUDICIAL_EXPLANATIONS = [
  'Candidate gaze is directed downwards (typical during problem solving / reading).',
  'Candidate head rotation shifted laterally (typical during reflection or thinking).',
  'Candidate gaze shifted slightly off-center (typical during question comprehension).',
  'Eye movement within normal cognitive focus variations.',
];

export const ATTENTION_LIMITATIONS_EXPLANATIONS = {
  GAZE_ANGLE: 'Gaze direction estimation may vary depending on camera mounting height or monitor distance.',
  LIGHTING_GLARE: 'Eyeglass reflections or backlight glare may occasionally affect eye openness measurements.',
  FACIAL_STRUCTURE: 'Individual anatomical variations in eyelid structure affect raw EAR (Eye Aspect Ratio) baselines.',
};
