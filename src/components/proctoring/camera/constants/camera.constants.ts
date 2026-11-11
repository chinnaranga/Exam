export const CAMERA_THRESHOLDS = {
  MIN_WIDTH: 640,
  MIN_HEIGHT: 480,
  TARGET_WIDTH: 1280,
  TARGET_HEIGHT: 720,
  MIN_FPS: 15,
  TARGET_FPS: 30,
  MIN_BRIGHTNESS: 20, // 0..100 scale
  MAX_BRIGHTNESS: 95,
  HEALTH_CHECK_INTERVAL_MS: 3000,
};

export const DEFAULT_MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: CAMERA_THRESHOLDS.TARGET_WIDTH, min: CAMERA_THRESHOLDS.MIN_WIDTH },
    height: { ideal: CAMERA_THRESHOLDS.TARGET_HEIGHT, min: CAMERA_THRESHOLDS.MIN_HEIGHT },
    frameRate: { ideal: CAMERA_THRESHOLDS.TARGET_FPS, min: CAMERA_THRESHOLDS.MIN_FPS },
    facingMode: 'user',
  },
  audio: false, // Audio belongs to Audio Manager or separate track handling
};

export const CAMERA_ERROR_MESSAGES = {
  NOT_ALLOWED: 'Camera access denied by browser or candidate. Please check site permissions.',
  NOT_FOUND: 'No webcam or video input devices detected on your system.',
  NOT_READABLE: 'Webcam is currently in use by another application (e.g. Zoom, Teams, Skype).',
  OVERCONSTRAINED: 'Connected camera does not meet minimum resolution or frame rate requirements.',
  ABORT: 'Webcam stream initialization was aborted unexpectedly.',
  UNSUPPORTED: 'MediaDevices API is unsupported in your browser or connection environment (HTTPS required).',
};
