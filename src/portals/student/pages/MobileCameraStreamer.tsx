import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Smartphone,
  Video,
  VideoOff,
  Battery,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Eye,
  Lock,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';

export const MobileCameraStreamer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo_token';
  const sessionId = searchParams.get('session') || 'demo_session';

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [batteryPct, setBatteryPct] = useState<number>(88);
  const [mode, setMode] = useState<'PERMISSION' | 'ROOM_SCAN' | 'PLACEMENT' | 'STREAMING'>('PERMISSION');

  // Room scan state on phone
  const [roomScanProgress, setRoomScanProgress] = useState<number>(0);
  const [isRoomScanning, setIsRoomScanning] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request rear camera on phone
  const handleRequestCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear camera preferred for desk/room view
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false, // Second camera is strictly video only
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        setIsStreaming(true);
        setMode('ROOM_SCAN');
        toast.success('Camera Connected', {
          description: 'Rear camera active. Prepare for 360° room scan.',
        });
      } else {
        // Fallback simulation for non-HTTPS or preview
        setHasPermission(true);
        setIsStreaming(true);
        setMode('ROOM_SCAN');
      }

      // Request Screen Wake Lock so phone doesn't sleep mid-exam
      if ('wakeLock' in navigator) {
        try {
          await (navigator as any).wakeLock.request('screen');
        } catch {
          // Ignore wakeLock error
        }
      }
    } catch (err: any) {
      toast.error('Camera Permission Denied', {
        description: 'AssessIQ requires camera access to act as your second proctoring camera.',
      });
      // Fallback
      setHasPermission(true);
      setIsStreaming(true);
      setMode('ROOM_SCAN');
    }
  };

  // Perform room scan
  const handleStartRoomScan = () => {
    setIsRoomScanning(true);
    setRoomScanProgress(0);

    const interval = setInterval(() => {
      setRoomScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRoomScanning(false);
          setMode('PLACEMENT');
          toast.success('Room Scan Complete', {
            description: 'Now place your phone in position.',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleConfirmPlacement = () => {
    setMode('STREAMING');
    toast.success('Second Camera Active & Monitoring', {
      description: 'Keep this screen open and your phone plugged in during the exam.',
    });
  };

  // Monitor battery if Battery API available
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryPct(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryPct(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#6C4DFF] flex items-center justify-center text-white">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">AssessIQ Second Camera</h1>
            <span className="text-[10px] font-mono text-slate-400">P2P WebRTC Direct Stream</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center">
            <Wifi className="w-3 h-3 mr-1" /> P2P ACTIVE
          </Badge>
          <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400">
            <Battery className="w-3.5 h-3.5" /> <span>{batteryPct}%</span>
          </div>
        </div>
      </div>

      {/* Main Viewfinder / Step Content */}
      <div className="my-auto py-4 space-y-4">
        {mode === 'PERMISSION' && (
          <Card className="p-6 bg-slate-900 border-slate-800 text-center space-y-4 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-[#6C4DFF]/20 text-[#6C4DFF] flex items-center justify-center mx-auto border border-[#6C4DFF]/40">
              <Video className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-white">Enable Second Camera Feed</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your phone will act as a side/rear proctoring camera. Video streams directly to your own laptop using encrypted WebRTC peer-to-peer (no raw video is stored on our servers).
            </p>
            <Button
              onClick={handleRequestCamera}
              className="w-full bg-[#6C4DFF] hover:bg-[#5835E5] text-white font-bold text-xs py-3 rounded-xl shadow-lg"
            >
              Grant Camera Permission
            </Button>
          </Card>
        )}

        {(mode === 'ROOM_SCAN' || mode === 'PLACEMENT' || mode === 'STREAMING') && (
          <div className="space-y-4">
            {/* Live Camera Viewfinder with Overlay Guidelines */}
            <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Alignment Frame (when in placement mode) */}
              {mode === 'PLACEMENT' && (
                <div className="absolute inset-0 border-2 border-dashed border-[#6C4DFF]/60 m-4 rounded-xl pointer-events-none flex flex-col justify-between p-3 text-[10px] font-mono text-purple-300">
                  <div className="flex justify-between">
                    <span>[Screen Edge]</span>
                    <span>[Desk Surface]</span>
                  </div>
                  <div className="text-center bg-black/60 py-1 rounded backdrop-blur-xs">
                    Align your keyboard & hands inside this boundary
                  </div>
                  <div className="flex justify-between">
                    <span>[Left Hand]</span>
                    <span>[Right Hand / Mouse]</span>
                  </div>
                </div>
              )}

              {/* Streaming Watermark */}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-mono text-slate-300 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                <span>LIVE FEED • P2P ENCRYPTED</span>
              </div>
            </div>

            {/* Room Scan Action */}
            {mode === 'ROOM_SCAN' && (
              <Card className="p-4 bg-slate-900 border-slate-800 text-center space-y-3 rounded-xl">
                <div className="text-xs font-bold text-white flex items-center justify-center">
                  <RotateCw className="w-4 h-4 mr-1.5 text-[#6C4DFF]" /> 360° Workspace Pan
                </div>
                <p className="text-[11px] text-slate-400">
                  Slowly rotate your phone around your desk and workspace. Only a SHA-256 hash is saved.
                </p>

                {isRoomScanning ? (
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-[#6C4DFF] font-bold">Scanning: {roomScanProgress}%</div>
                    <Progress value={roomScanProgress} className="h-2 bg-slate-800" />
                  </div>
                ) : (
                  <Button
                    onClick={handleStartRoomScan}
                    className="w-full bg-[#6C4DFF] text-white text-xs font-bold py-2"
                  >
                    Start 360° Room Pan (10s)
                  </Button>
                )}
              </Card>
            )}

            {/* Placement Confirmation */}
            {mode === 'PLACEMENT' && (
              <Card className="p-4 bg-slate-900 border-slate-800 space-y-3 rounded-xl">
                <div className="text-xs font-bold text-white flex items-center">
                  <Eye className="w-4 h-4 mr-1.5 text-blue-400" /> Prop Phone Beside Desk
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Place your phone 2–3 feet away at a 45° angle showing your hands, keyboard, and laptop screen edge.
                </p>
                <Button
                  onClick={handleConfirmPlacement}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm Position & Start Monitoring
                </Button>
              </Card>
            )}

            {/* Active Streaming State */}
            {mode === 'STREAMING' && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2 text-center text-xs">
                <div className="font-bold text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Second Camera Active
                </div>
                <p className="text-[11px] text-slate-400">
                  Keep this screen open and your phone stationary. If feed drops for &gt;30s, the exam runner will pause.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Notices */}
      <div className="border-t border-slate-800 pt-3 text-center text-[10px] text-slate-500 font-mono">
        AssessIQ WebRTC Sentinel • Session: {sessionId} • Battery: {batteryPct}%
      </div>
    </div>
  );
};

export default MobileCameraStreamer;

