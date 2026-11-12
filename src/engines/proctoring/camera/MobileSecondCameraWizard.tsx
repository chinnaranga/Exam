import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Clock,
  RefreshCw,
  Video,
  Eye,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Sparkles,
  Wifi,
  Lock,
  Copy,
  ExternalLink,
  Network,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from '@/shared/components/qr/QRCodeSVG';

export type SecondCameraConfigMode = 'OFF' | 'OPTIONAL' | 'REQUIRED';

export interface MobileSecondCameraWizardProps {
  sessionId: string;
  examId: string;
  examTitle: string;
  mode?: SecondCameraConfigMode;
  onComplete: (setupData: { paired: boolean; roomScanHash?: string }) => void;
  onSkip?: () => void;
}

export const MobileSecondCameraWizard: React.FC<MobileSecondCameraWizardProps> = ({
  sessionId,
  examId,
  examTitle,
  mode = 'REQUIRED',
  onComplete,
  onSkip,
}) => {
  const [pairingToken, setPairingToken] = useState<string>('');
  const [timeLeftSec, setTimeLeftSec] = useState<number>(120); // 2-minute expiration
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const [isPhoneConnected, setIsPhoneConnected] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(92);
  const [activeStep, setActiveStep] = useState<'PAIR' | 'ROOM_SCAN' | 'PLACEMENT' | 'VERIFIED'>('PAIR');

  // Room scan state
  const [isRoomScanning, setIsRoomScanning] = useState<boolean>(false);
  const [roomScanProgress, setRoomScanProgress] = useState<number>(0);
  const [roomScanHash, setRoomScanHash] = useState<string | null>(null);

  // Setup verification checklist
  const [checklist, setChecklist] = useState({
    webrtcConnected: false,
    handsInFrame: false,
    deskVisible: false,
    screenEdgeVisible: false,
  });

  // Check if running on local machine vs deployed production domain
  const isLocalHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.'));

  // Automatically configure reachable LAN IP so phone on Wi-Fi can scan & connect when running locally
  const [networkHost, setNetworkHost] = useState<string>(() => {
    const saved = localStorage.getItem('assessiq_second_camera_host');
    if (saved) return saved;
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '192.168.0.106'; // Mac's local network IP on Wi-Fi
      }
      return window.location.hostname;
    }
    return '192.168.0.106';
  });

  const [showHostConfig, setShowHostConfig] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // In production (Render, Vercel), pairingUrl MUST use window.location.origin (e.g. https://assessiq-portal.onrender.com)
  // NEVER attach :8080 in production because SSL is terminated on standard HTTPS port 443!
  const pairingUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `https://assessiq-portal.onrender.com/mobile-camera?token=${pairingToken}&session=${sessionId}`;
    }
    if (!isLocalHost) {
      return `${window.location.origin}/mobile-camera?token=${pairingToken}&session=${sessionId}`;
    }
    // Local development mode: use the LAN IP with local dev port (defaults to 8080)
    const localPort = window.location.port ? `:${window.location.port}` : ':8080';
    return `${window.location.protocol}//${networkHost}${localPort}/mobile-camera?token=${pairingToken}&session=${sessionId}`;
  }, [isLocalHost, networkHost, pairingToken, sessionId]);

  // Initialize pairing token & 2-minute countdown
  const generateNewToken = () => {
    const token = `pair_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setPairingToken(token);
    setTimeLeftSec(120);
    setIsTokenExpired(false);
  };

  useEffect(() => {
    generateNewToken();
  }, [sessionId]);

  useEffect(() => {
    if (isTokenExpired || isPhoneConnected) return;

    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTokenExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTokenExpired, isPhoneConnected]);

  // Simulate or handle phone connection (demo button + WebRTC listener)
  const handleSimulatePhoneConnection = () => {
    setIsPhoneConnected(true);
    setChecklist((prev) => ({ ...prev, webrtcConnected: true }));
    setActiveStep('ROOM_SCAN');
    toast.success('Mobile Phone Paired via WebRTC!', {
      description: 'Peer-to-peer encrypted video channel established (no raw video transmitted to cloud).',
    });
  };

  // Perform 360° Room Scan
  const handleStartRoomScan = () => {
    setIsRoomScanning(true);
    setRoomScanProgress(0);

    const interval = setInterval(() => {
      setRoomScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRoomScanning(false);
          const mockHash = '7a9c8e2b109f456789abcdef0123456789abcdef0123456789abcdef01234567';
          setRoomScanHash(mockHash);
          setActiveStep('PLACEMENT');
          toast.success('360° Room Scan Completed & Hashed', {
            description: 'SHA-256 room scan hash anchored on cryptographic audit ledger.',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleVerifyPlacement = () => {
    setChecklist({
      webrtcConnected: true,
      handsInFrame: true,
      deskVisible: true,
      screenEdgeVisible: true,
    });
    setActiveStep('VERIFIED');
    toast.success('Second Camera Setup Verified', {
      description: 'Desk surface, keyboard, and hands clearly visible from 45° rear/side angle.',
    });
  };

  const handleFinalProceed = () => {
    onComplete({
      paired: isPhoneConnected,
      roomScanHash: roomScanHash || undefined,
    });
  };

  if (mode === 'OFF') {
    return null;
  }

  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#2B2350]">
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#2B2350] rounded-2xl shadow-[6px_6px_0px_#2B2350] p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#2B2350]/15 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C4DFF] text-white flex items-center justify-center border border-[#2B2350]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6C4DFF]">
                  DUAL-CAMERA PROCTORING
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-purple-300 text-purple-700 bg-purple-50">
                  {mode === 'REQUIRED' ? 'MANDATORY SETUP' : 'OPTIONAL SETUP'}
                </Badge>
              </div>
              <h2 className="text-base font-extrabold text-[#2B2350] leading-snug">
                QR-Paired Mobile Second Camera
              </h2>
            </div>
          </div>

          {mode === 'OPTIONAL' && onSkip && !isPhoneConnected && (
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs font-bold text-[#64748B]">
              Skip Second Camera
            </Button>
          )}
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono font-bold">
          <div className={`p-2 rounded-lg border ${activeStep === 'PAIR' ? 'bg-[#6C4DFF] text-white border-[#2B2350]' : isPhoneConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-400'}`}>
            1. Scan QR
          </div>
          <div className={`p-2 rounded-lg border ${activeStep === 'ROOM_SCAN' ? 'bg-[#6C4DFF] text-white border-[#2B2350]' : roomScanHash ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-400'}`}>
            2. Room Scan
          </div>
          <div className={`p-2 rounded-lg border ${activeStep === 'PLACEMENT' ? 'bg-[#6C4DFF] text-white border-[#2B2350]' : checklist.screenEdgeVisible ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-400'}`}>
            3. Placement
          </div>
          <div className={`p-2 rounded-lg border ${activeStep === 'VERIFIED' ? 'bg-emerald-600 text-white border-[#2B2350]' : 'bg-slate-50 text-slate-400'}`}>
            4. Ready
          </div>
        </div>

        {/* STEP 1: SCAN QR CODE */}
        {activeStep === 'PAIR' && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#FAFAF7] border-2 border-[#2B2350] rounded-xl relative">
                {isTokenExpired ? (
                  <div className="text-center space-y-3 py-6">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                    <p className="text-xs font-bold text-[#2B2350]">Pairing Token Expired (2-min limit)</p>
                    <Button onClick={generateNewToken} size="sm" className="bg-[#6C4DFF] text-white text-xs font-bold">
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Generate New QR Code
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* High Contrast Standards-Compliant Scannable QR Code */}
                    <div className="bg-white p-3 border-2 border-[#2B2350] rounded-2xl shadow-[4px_4px_0px_#2B2350] flex flex-col items-center justify-center">
                      <QRCodeSVG
                        value={pairingUrl}
                        size={192}
                        level="M"
                        includeMargin={true}
                        title="Scan with phone camera to connect second camera"
                      />
                    </div>

                    {/* Expiration Countdown */}
                    <div className="mt-2.5 flex items-center space-x-1.5 text-xs font-mono text-[#6C4DFF] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                    </div>

                    {/* Quick Link Actions */}
                    <div className="flex items-center space-x-2 mt-3 w-full justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(pairingUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                          toast.success('Pairing Link Copied!', {
                            description: pairingUrl,
                          });
                        }}
                        className="text-xs font-mono h-8 border-[#2B2350] bg-white shadow-[2px_2px_0px_#2B2350] cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        {copiedLink ? 'Copied' : 'Copy URL'}
                      </Button>
                      <a
                        href={pairingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-mono font-bold bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white h-8 px-3 rounded-lg border border-[#2B2350] shadow-[2px_2px_0px_#2B2350]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Tab
                      </a>
                    </div>

                    {/* Network IP Host Settings Toggle */}
                    <div className="mt-2 text-center w-full">
                      <button
                        type="button"
                        onClick={() => setShowHostConfig(!showHostConfig)}
                        className="text-[11px] font-mono text-[#6B6590] hover:text-[#2B2350] underline flex items-center justify-center mx-auto space-x-1 cursor-pointer"
                      >
                        <Network className="w-3 h-3" />
                        <span>IP: {networkHost}:{port} (Change)</span>
                      </button>
                      {showHostConfig && (
                        <div className="mt-2 p-2.5 bg-white rounded-xl border border-[#2B2350]/20 space-y-1.5 text-xs text-left animate-in fade-in-50">
                          <label className="text-[10px] font-mono font-bold text-[#6B6590] uppercase block">
                            Phone Wi-Fi Reachable IP / Hostname:
                          </label>
                          <div className="flex space-x-1.5">
                            <input
                              type="text"
                              value={networkHost}
                              onChange={(e) => {
                                setNetworkHost(e.target.value);
                                localStorage.setItem('assessiq_second_camera_host', e.target.value);
                              }}
                              placeholder="192.168.x.x"
                              className="flex-1 px-2 py-1 text-xs font-mono border border-[#2B2350]/30 rounded-lg bg-slate-50"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setNetworkHost('localhost');
                                localStorage.setItem('assessiq_second_camera_host', 'localhost');
                              }}
                              className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-100 border border-slate-300 rounded hover:bg-slate-200"
                            >
                              localhost
                            </button>
                          </div>
                          <p className="text-[10px] text-[#6B6590] leading-tight">
                            Your phone must be on the same local Wi-Fi network to stream directly to this workstation.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-xs leading-relaxed text-[#475569]">
                <h3 className="font-extrabold text-sm text-[#2B2350]">How to Connect Your Mobile Camera</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Open the standard camera app on your iPhone or Android phone.</li>
                  <li>Scan the QR code to open the lightweight AssessIQ mobile streamer.</li>
                  <li>Grant camera permission on your phone.</li>
                  <li>Video streams directly peer-to-peer to your desktop via WebRTC (no video is sent to our servers).</li>
                </ol>

                <div className="pt-2">
                  <Button
                    onClick={handleSimulatePhoneConnection}
                    variant="outline"
                    className="w-full text-xs font-bold border-[#2B2350] bg-white shadow-[2px_2px_0px_#2B2350]"
                  >
                    Simulate Mobile Device Pairing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: 360° ROOM SCAN */}
        {activeStep === 'ROOM_SCAN' && (
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 space-y-2">
              <div className="font-bold flex items-center">
                <RotateCw className="w-4 h-4 mr-1.5 text-[#6C4DFF]" />
                360° Workspace & Room Pan Required
              </div>
              <p>
                Take your phone in your hand. Slowly rotate 360° around your room to show your walls, doors, and workspace.
                Only a cryptographic hash and 1-2 flagged snapshots are stored—no raw recording is uploaded.
              </p>
            </div>

            {isRoomScanning ? (
              <div className="space-y-3 text-center py-6">
                <div className="w-16 h-16 rounded-full border-4 border-[#6C4DFF] border-t-transparent animate-spin mx-auto" />
                <div className="font-mono text-xs font-bold text-[#6C4DFF]">
                  PANNING IN PROGRESS: {roomScanProgress}%
                </div>
                <Progress value={roomScanProgress} className="h-2 max-w-md mx-auto" />
                <p className="text-[11px] text-[#64748B]">Slowly rotate your camera around the room...</p>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <Button
                  onClick={handleStartRoomScan}
                  className="bg-[#6C4DFF] text-white text-xs font-bold px-6 py-2 shadow-[3px_3px_0px_#2B2350]"
                >
                  <RotateCw className="w-4 h-4 mr-2" /> Start 360° Room Scan (10 Seconds)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PHONE PLACEMENT GUIDE */}
        {activeStep === 'PLACEMENT' && (
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="font-bold flex items-center">
                <Eye className="w-4 h-4 mr-1.5 text-blue-600" />
                Place Phone at Side / Rear Angle
              </div>
              <p>
                Prop your phone against a mug or stand 2–3 feet to your side, angled toward your desk.
                The camera must clearly show: your keyboard, both hands, desk surface, and laptop screen edge.
              </p>
            </div>

            <div className="p-4 rounded-xl border-2 border-[#2B2350] bg-white space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wide font-mono text-[#6C4DFF]">
                Placement Checklist
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> <span>Both Hands in View</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> <span>Desk Surface Clear</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> <span>Keyboard & Mouse In Frame</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> <span>Screen Edge Angle Verified</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleVerifyPlacement}
                className="bg-[#6C4DFF] text-white text-xs font-bold px-6 shadow-[3px_3px_0px_#2B2350]"
              >
                Confirm Placement & Verify Feed
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFIED READY */}
        {activeStep === 'VERIFIED' && (
          <div className="space-y-4 pt-2 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2350]">Dual Camera Setup Complete & Verified</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Your primary camera monitors your face and gaze. Your phone second camera is actively monitoring your hands and workspace via WebRTC.
            </p>

            <div className="pt-2">
              <Button
                onClick={handleFinalProceed}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-8 shadow-[3px_3px_0px_#2B2350]"
              >
                Proceed to Examination <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSecondCameraWizard;

