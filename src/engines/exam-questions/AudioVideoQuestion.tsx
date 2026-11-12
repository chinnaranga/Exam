import React, { useState, useRef, useEffect } from 'react';
import { Mic, Video, Square, Play, RotateCcw, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface AudioVideoPayload {
  mediaType: 'AUDIO' | 'VIDEO';
  durationSeconds: number;
  dataUrl: string;
  recordedAt: number;
}

export interface AudioVideoQuestionProps {
  mediaType: 'AUDIO' | 'VIDEO';
  maxDurationSeconds: number; // e.g. 180
  value?: AudioVideoPayload | null;
  onChange: (value: AudioVideoPayload | null) => void;
  disabled?: boolean;
}

export const AudioVideoQuestion: React.FC<AudioVideoQuestionProps> = ({
  mediaType,
  maxDurationSeconds = 180,
  value,
  onChange,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      stopTracks();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (disabled) return;
    setErrorMessage(null);
    chunksRef.current = [];

    try {
      const constraints: MediaStreamConstraints =
        mediaType === 'VIDEO'
          ? { video: { width: 640, height: 480 }, audio: true }
          : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (mediaType === 'VIDEO' && liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play().catch(() => {});
      }

      const mimeType = mediaType === 'VIDEO' ? 'video/webm' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stopTracks();
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          onChange({
            mediaType,
            durationSeconds: recordingSeconds,
            dataUrl: String(reader.result || ''),
            recordedAt: Date.now(),
          });
        };
        reader.readAsDataURL(blob);
        setIsRecording(false);
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev + 1 >= maxDurationSeconds) {
            stopRecording();
            return maxDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage(
        err?.message || `Unable to access ${mediaType.toLowerCase()} device. Please grant browser permissions.`
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    if (disabled) return;
    stopTracks();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
    onChange(null);
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>
          Record your {mediaType === 'VIDEO' ? 'video explanation' : 'audio response'} locally.
        </span>
        <span className="font-semibold text-slate-700">
          Max Duration: <code className="text-[#6C4DFF] bg-purple-50 px-1 py-0.5 rounded">{formatSecs(maxDurationSeconds)}</code>
        </span>
      </div>

      {/* Privacy & Network Policy Badge */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center space-x-2">
        <ShieldAlert className="w-4 h-4 shrink-0 text-blue-600" />
        <span>
          <strong>Local Buffer Policy:</strong> Your {mediaType.toLowerCase()} response is recorded in memory locally and will only be uploaded upon final exam submission to prevent bandwidth congestion.
        </span>
      </div>

      {/* Live recording or recorded preview */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs text-center">
        {mediaType === 'VIDEO' && (
          <div className="w-full max-w-md mx-auto aspect-video rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800 flex items-center justify-center">
            {isRecording ? (
              <video ref={liveVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : value ? (
              <video src={value.dataUrl} controls className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-500 text-xs font-mono flex flex-col items-center space-y-2">
                <Video className="w-8 h-8 opacity-40" />
                <span>Camera preview will show here while recording</span>
              </div>
            )}
          </div>
        )}

        {mediaType === 'AUDIO' && value && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <audio src={value.dataUrl} controls className="w-full max-w-md" />
          </div>
        )}

        {/* Timer & Controls */}
        <div className="flex flex-col items-center space-y-3">
          <div className="font-mono text-xl font-bold text-[#0F172A] flex items-center space-x-2">
            {isRecording && <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />}
            <span>
              {isRecording ? formatSecs(recordingSeconds) : value ? `${formatSecs(value.durationSeconds)} recorded` : '00:00'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {!isRecording && !value && (
              <Button
                type="button"
                onClick={startRecording}
                disabled={disabled}
                className="bg-[#6C4DFF] hover:bg-[#5b3ce6] text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center space-x-2 shadow-xs cursor-pointer"
              >
                {mediaType === 'VIDEO' ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>Start {mediaType === 'VIDEO' ? 'Video' : 'Audio'} Recording</span>
              </Button>
            )}

            {isRecording && (
              <Button
                type="button"
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center space-x-2 shadow-xs cursor-pointer animate-pulse"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </Button>
            )}

            {value && !disabled && (
              <Button
                type="button"
                variant="outline"
                onClick={resetRecording}
                className="border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-record Response
              </Button>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
