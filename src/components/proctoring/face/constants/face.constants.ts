export const FACE_DETECTION_CONFIG = {
  INFERENCE_TARGET_FPS: 8, // 5..10 FPS
  INFERENCE_INTERVAL_MS: 125, // 1000ms / 8fps
  MIN_DETECTION_CONFIDENCE: 0.65,
  FACE_MISSING_ALERT_THRESHOLD_MS: 5000,
  LONG_ABSENCE_THRESHOLD_MS: 15000,
  VERIFICATION_MATCH_THRESHOLD: 75, // 0..100 similarity score
};

export const FACE_LIMITATIONS_EXPLANATIONS = {
  LIGHTING: 'Severe glare, backlighting, or low ambient light may degrade face detection precision.',
  OBSTRUCTION: 'Hand on chin, surgical masks, or heavy glasses may trigger partial face or occlusion warnings.',
  CAMERA_DISTANCE: 'Candidate sitting too close or too far from the camera lens may reduce bounding box accuracy.',
  MULTIPLE_FACES: 'Reflections in mirrors or background posters may occasionally trigger false multiple face alerts.',
};
