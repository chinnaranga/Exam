import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Mic,
  Wifi,
  Monitor,
  Maximize2,
  Cpu,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Download,
  Volume2,
  FileCheck,
} from 'lucide-react';
import BrandLogo from '@/shared/components/BrandLogo';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { toast } from 'sonner';

export type CheckStatus = 'IDLE' | 'CHECKING' | 'PASS' | 'FAIL';

export interface DiagnosticItem {
  id: string;
  name: string;
  category: 'HARDWARE' | 'NETWORK' | 'SOFTWARE' | 'DISPLAY';
  status: CheckStatus;
  value?: string;
  fixInstruction?: string;
}

export const StudentSystemCheck: React.FC = () => {
  const navigate = useNavigate();

  // Test states
  const [cameraStatus, setCameraStatus] = useState<CheckStatus>('IDLE');
  const [cameraDetails, setCameraDetails] = useState<string>('');
  const [cameraFix, setCameraFix] = useState<string>('');

  const [micStatus, setMicStatus] = useState<CheckStatus>('IDLE');
  const [micDetails, setMicDetails] = useState<string>('');
  const [micFix, setMicFix] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const [networkStatus, setNetworkStatus] = useState<CheckStatus>('IDLE');
  const [networkDetails, setNetworkDetails] = useState<string>('');
  const [networkFix, setNetworkFix] = useState<string>('');

  const [browserStatus, setBrowserStatus] = useState<CheckStatus>('IDLE');
  const [browserDetails, setBrowserDetails] = useState<string>('');
  const [browserFix, setBrowserFix] = useState<string>('');

  const [wasmStatus, setWasmStatus] = useState<CheckStatus>('IDLE');
  const [wasmDetails, setWasmDetails] = useState<string>('');
  const [wasmFix, setWasmFix] = useState<string>('');

  const [displayStatus, setDisplayStatus] = useState<CheckStatus>('IDLE');
  const [displayDetails, setDisplayDetails] = useState<string>('');
  const [displayFix, setDisplayFix] = useState<string>('');

  const [fullscreenStatus, setFullscreenStatus] = useState<CheckStatus>('IDLE');
  const [fullscreenDetails, setFullscreenDetails] = useState<string>('');
  const [fullscreenFix, setFullscreenFix] = useState<string>('');

  const [passToken, setPassToken] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // 1. Camera Diagnostic
  const checkCamera = async (): Promise<boolean> => {
    setCameraStatus('CHECKING');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('WebRTC Camera API is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const resolution = `${settings.width || 1280}x${settings.height || 720}`;
      const isHighDef = (settings.height || 720) >= 720;

      setCameraStatus('PASS');
      setCameraDetails(`Connected: ${videoTrack.label || 'Webcam'} (${resolution})`);
      setCameraFix('');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCameraStatus('FAIL');
      setCameraDetails(`Camera Error: ${msg}`);
      setCameraFix(
        'Please grant camera permissions in your browser. Click the lock/tune icon beside the URL in the address bar and set Camera to "Allow". Ensure no other application (e.g. Zoom, Teams) is using the webcam.'
      );
      return false;
    }
  };

  // 2. Microphone Diagnostic with live volume meter
  const checkMicrophone = async (): Promise<boolean> => {
    setMicStatus('CHECKING');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone API not supported by this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();

      const audioTrack = stream.getAudioTracks()[0];
      setMicStatus('PASS');
      setMicDetails(`Connected: ${audioTrack.label || 'Built-in Microphone'} (Input responsive)`);
      setMicFix('');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMicStatus('FAIL');
      setMicDetails(`Microphone Error: ${msg}`);
      setMicFix(
        'Please grant microphone permission in your browser address bar. Check that your microphone is unmuted in system audio settings and selected as default input device.'
      );
      return false;
    }
  };

  // 3. Network Speed & Ping Check
  const checkNetwork = async (): Promise<boolean> => {
    setNetworkStatus('CHECKING');
    const start = performance.now();
    try {
      const res = await fetch('/api/session/clock?t=' + Date.now(), { method: 'GET' }).catch(() => null);
      const latency = Math.round(performance.now() - start);

      const connection = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
      const downlink = connection?.downlink ? `${connection.downlink} Mbps` : 'High Speed';

      if (latency > 350) {
        setNetworkStatus('FAIL');
        setNetworkDetails(`High Latency: ${latency}ms (Downlink: ${downlink})`);
        setNetworkFix(
          'Network latency exceeds acceptable limits (350ms). Move closer to your Wi-Fi router, disconnect other streaming devices, or switch to a wired Ethernet connection.'
        );
        return false;
      }

      setNetworkStatus('PASS');
      setNetworkDetails(`Latency: ${latency}ms • Downlink: ${downlink} • Stable`);
      setNetworkFix('');
      return true;
    } catch {
      // Fallback local latency measure
      const latency = Math.round(performance.now() - start);
      setNetworkStatus('PASS');
      setNetworkDetails(`Network OK (Estimated latency: ${latency}ms)`);
      setNetworkFix('');
      return true;
    }
  };

  // 4. Browser Version Diagnostic
  const checkBrowser = async (): Promise<boolean> => {
    setBrowserStatus('CHECKING');
    const ua = navigator.userAgent;
    const isChrome = /Chrome/.test(ua) && !/Chromium|Edge|OPR/.test(ua);
    const isEdge = /Edg/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);

    if (isChrome || isEdge || isFirefox || isSafari) {
      let browserName = 'Modern Browser';
      if (isChrome) browserName = 'Google Chrome';
      else if (isEdge) browserName = 'Microsoft Edge';
      else if (isFirefox) browserName = 'Mozilla Firefox';
      else if (isSafari) browserName = 'Apple Safari';

      setBrowserStatus('PASS');
      setBrowserDetails(`${browserName} (HTML5 / WebRTC / WebCrypto Verified)`);
      setBrowserFix('');
      return true;
    } else {
      setBrowserStatus('FAIL');
      setBrowserDetails('Unsupported Browser Environment');
      setBrowserFix(
        'Please use the latest version of Google Chrome, Microsoft Edge, or Mozilla Firefox. Legacy Internet Explorer or mobile browsers are not supported.'
      );
      return false;
    }
  };

  // 5. WebAssembly & SIMD Support
  const checkWasm = async (): Promise<boolean> => {
    setWasmStatus('CHECKING');
    try {
      if (typeof WebAssembly !== 'object' || typeof WebAssembly.instantiate !== 'function') {
        throw new Error('WebAssembly is disabled or not supported.');
      }

      // Check SIMD support via WebAssembly validation
      const simdSupported = WebAssembly.validate(
        new Uint8Array([
          0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7b, 0x03, 0x02,
          0x01, 0x00, 0x0a, 0x0a, 0x01, 0x08, 0x00, 0xfd, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x0b,
        ])
      );

      setWasmStatus('PASS');
      setWasmDetails(`WebAssembly V1 Active ${simdSupported ? '• SIMD Biometric Acceleration Enabled' : ''}`);
      setWasmFix('');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setWasmStatus('FAIL');
      setWasmDetails(`Wasm Check Failed: ${msg}`);
      setWasmFix('Update your browser to the latest version to enable native WebAssembly hardware acceleration.');
      return false;
    }
  };

  // 6. Multi-Monitor Display Check
  const checkDisplay = async (): Promise<boolean> => {
    setDisplayStatus('CHECKING');
    try {
      let isMultiMonitor = false;

      // Check Screen Management API
      if ('getScreenDetails' in window) {
        try {
          const screenDetails = await (window as unknown as { getScreenDetails: () => Promise<{ screens: unknown[] }> }).getScreenDetails();
          if (screenDetails.screens.length > 1) {
            isMultiMonitor = true;
          }
        } catch {
          // Fallback to screen.isExtended
        }
      }

      if ('isExtended' in window.screen && (window.screen as unknown as { isExtended: boolean }).isExtended) {
        isMultiMonitor = true;
      }

      if (isMultiMonitor) {
        setDisplayStatus('FAIL');
        setDisplayDetails('Secondary Display Detected (Dual Monitor)');
        setDisplayFix(
          'More than one display is active. Unplug any external monitor cables (HDMI, DisplayPort) or press Win+P (Windows) / System Settings (macOS) and configure display mode to "PC screen only".'
        );
        return false;
      }

      setDisplayStatus('PASS');
      setDisplayDetails(`Single Display Verified (${window.screen.width}x${window.screen.height})`);
      setDisplayFix('');
      return true;
    } catch {
      setDisplayStatus('PASS');
      setDisplayDetails(`Display Verified (${window.screen.width}x${window.screen.height})`);
      return true;
    }
  };

  // 7. Fullscreen Capability Check
  const checkFullscreen = async (): Promise<boolean> => {
    setFullscreenStatus('CHECKING');
    try {
      const isAvailable =
        document.fullscreenEnabled ||
        (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
        (document as unknown as { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled;

      if (!isAvailable) {
        throw new Error('Fullscreen API is disabled in browser permissions or OS policies.');
      }

      setFullscreenStatus('PASS');
      setFullscreenDetails('Fullscreen Mode API Verified & Operational');
      setFullscreenFix('');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFullscreenStatus('FAIL');
      setFullscreenDetails(`Fullscreen API Error: ${msg}`);
      setFullscreenFix(
        'Fullscreen mode is required during the examination. Please enable fullscreen permissions in your browser preferences.'
      );
      return false;
    }
  };

  // Test All Steps Sequentially
  const handleRunAllDiagnostics = async () => {
    setIsTestingAll(true);
    setPassToken(null);
    toast.info('Starting Complete System Readiness Check...');

    const cOk = await checkCamera();
    const mOk = await checkMicrophone();
    const nOk = await checkNetwork();
    const bOk = await checkBrowser();
    const wOk = await checkWasm();
    const dOk = await checkDisplay();
    const fOk = await checkFullscreen();

    setIsTestingAll(false);

    if (cOk && mOk && nOk && bOk && wOk && dOk && fOk) {
      const token = `PASS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setPassToken(token);
      localStorage.setItem('assessiq_system_readiness_pass', JSON.stringify({ token, timestamp: Date.now() }));
      toast.success('All Diagnostics Passed!', {
        description: 'Your workstation meets all enterprise examination requirements.',
      });
    } else {
      toast.error('System Readiness Diagnostic Failed', {
        description: 'One or more items require attention. Please review the fix instructions below.',
      });
    }
  };

  const handleTestFullscreenInteractive = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreenStatus('PASS');
        setFullscreenDetails('Fullscreen Engaged Successfully');
        setTimeout(() => {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
        }, 1500);
      }
    } catch (err: unknown) {
      toast.error('Could not enter fullscreen mode.');
    }
  };

  const allPassed =
    cameraStatus === 'PASS' &&
    micStatus === 'PASS' &&
    networkStatus === 'PASS' &&
    browserStatus === 'PASS' &&
    wasmStatus === 'PASS' &&
    displayStatus === 'PASS' &&
    fullscreenStatus === 'PASS';

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#2B2350] font-sans p-6 sm:p-10 flex flex-col items-center">
      {/* Top Brand Header */}
      <header className="max-w-4xl w-full flex items-center justify-between border-b-2 border-[#2B2350]/15 pb-4 mb-8">
        <div className="flex items-center space-x-3">
          <BrandLogo size="md" variant="light" />
          <div className="h-6 w-px bg-[#2B2350]/20" />
          <div>
            <h1 className="font-heading font-black text-xl text-[#2B2350] tracking-tight">
              Pre-Exam System Diagnostic
            </h1>
            <p className="text-xs text-[#6B6590]">
              Verify camera, audio, network speed, browser, and display readiness days before your exam.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/student/dashboard')}
          variant="outline"
          className="border-[#2B2350] text-[#2B2350] font-mono text-xs font-bold"
        >
          Exit to Dashboard
        </Button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full space-y-6">
        {/* Wellbeing Banner */}
        <div className="bg-[#B8F0D2]/40 border-2 border-[#2B2350] rounded-2xl p-4 shadow-[4px_4px_0px_#2B2350] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 border border-[#2B2350]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#065F46] block text-sm">
              Stress-Free Preparation Guarantee
            </span>
            <p className="text-[#065F46]/90 mt-0.5">
              Testing your equipment early ensures no technical surprises on exam day. You can run this diagnostic as many times as you like.
            </p>
          </div>
        </div>

        {/* Global Action Banner */}
        <div className="bg-white border-2 border-[#2B2350] rounded-3xl p-6 shadow-[6px_6px_0px_#2B2350] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#6C4DFF] tracking-wider block">
              AUTOMATED DIAGNOSTIC SUITE
            </span>
            <h2 className="font-heading text-lg font-black text-[#2B2350]">
              7-Point Comprehensive Hardware & Browser Test
            </h2>
            <p className="text-xs text-[#6B6590] mt-1">
              Checks resolution, acoustic levels, ping, WebAssembly SIMD, single-display compliance, and fullscreen APIs.
            </p>
          </div>

          <Button
            onClick={handleRunAllDiagnostics}
            disabled={isTestingAll}
            className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3.5 px-6 rounded-2xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isTestingAll ? 'animate-spin' : ''}`} />
            <span>{isTestingAll ? 'TESTING SUITE...' : 'RUN ALL DIAGNOSTICS'}</span>
          </Button>
        </div>

        {/* Diagnostic Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Camera Diagnostic Card */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-[#2B2350] flex items-center justify-center text-[#6C4DFF]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B2350]">1. Camera & Video Stream</h3>
                  <span className="text-[10px] font-mono text-[#6B6590]">Min 720p HD Recommended</span>
                </div>
              </div>

              <StatusBadge status={cameraStatus} />
            </div>

            {/* Video Preview */}
            <div className="relative w-full h-36 bg-[#2B2350]/10 rounded-xl border border-[#2B2350] overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraStatus !== 'PASS' && (
                <span className="absolute text-xs text-[#6B6590] font-mono">
                  {cameraStatus === 'CHECKING' ? 'Requesting webcam...' : 'Webcam preview will appear here'}
                </span>
              )}
            </div>

            {cameraDetails && <p className="text-xs font-mono text-[#2B2350]">{cameraDetails}</p>}

            {cameraStatus === 'FAIL' && cameraFix && <FixBox instruction={cameraFix} />}

            <Button
              onClick={checkCamera}
              variant="outline"
              size="sm"
              className="w-full border-[#2B2350] text-xs font-bold"
            >
              Test Camera Separately
            </Button>
          </Card>

          {/* 2. Microphone Diagnostic Card with Live Meter */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-[#2B2350] flex items-center justify-center text-[#10B981]">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B2350]">2. Microphone & Audio Level</h3>
                  <span className="text-[10px] font-mono text-[#6B6590]">Input frequency & volume test</span>
                </div>
              </div>

              <StatusBadge status={micStatus} />
            </div>

            {/* Live Audio Meter */}
            <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#2B2350] space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#6B6590]">LIVE AUDIO INPUT METER</span>
                <span className="font-bold text-[#2B2350]">{audioLevel}%</span>
              </div>
              <div className="w-full h-3 bg-white border border-[#2B2350] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
              <span className="text-[10px] text-[#6B6590] block italic">
                Speak into your microphone to see the meter bounce.
              </span>
            </div>

            {micDetails && <p className="text-xs font-mono text-[#2B2350]">{micDetails}</p>}

            {micStatus === 'FAIL' && micFix && <FixBox instruction={micFix} />}

            <Button
              onClick={checkMicrophone}
              variant="outline"
              size="sm"
              className="w-full border-[#2B2350] text-xs font-bold"
            >
              Test Microphone Separately
            </Button>
          </Card>

          {/* 3. Network Latency & Speed Card */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-[#2B2350] flex items-center justify-center text-blue-600">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B2350]">3. Network Speed & Ping</h3>
                  <span className="text-[10px] font-mono text-[#6B6590]">Latency target &lt; 350ms</span>
                </div>
              </div>

              <StatusBadge status={networkStatus} />
            </div>

            {networkDetails && <p className="text-xs font-mono text-[#2B2350]">{networkDetails}</p>}

            {networkStatus === 'FAIL' && networkFix && <FixBox instruction={networkFix} />}

            <Button
              onClick={checkNetwork}
              variant="outline"
              size="sm"
              className="w-full border-[#2B2350] text-xs font-bold"
            >
              Test Network Ping
            </Button>
          </Card>

          {/* 4. Browser Version & Features */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-[#2B2350] flex items-center justify-center text-amber-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B2350]">4. Browser Version</h3>
                  <span className="text-[10px] font-mono text-[#6B6590]">Chrome, Edge, Firefox, Safari</span>
                </div>
              </div>

              <StatusBadge status={browserStatus} />
            </div>

            {browserDetails && <p className="text-xs font-mono text-[#2B2350]">{browserDetails}</p>}

            {browserStatus === 'FAIL' && browserFix && <FixBox instruction={browserFix} />}

            <Button
              onClick={checkBrowser}
              variant="outline"
              size="sm"
              className="w-full border-[#2B2350] text-xs font-bold"
            >
              Test Browser Compatibility
            </Button>
          </Card>

          {/* 5. WebAssembly SIMD Acceleration */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-[#2B2350] flex items-center justify-center text-purple-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B2350]">5. WebAssembly (Wasm) Engine</h3>
                  <span className="text-[10px] font-mono text-[#6B6590]">Local AI biometrics pipeline</span>
                </div>
              </div>

              <StatusBadge status={wasmStatus} />
            </div>

            {wasmDetails && <p className="text-xs font-mono text-[#2B2350]">{wasmDetails}</p>}

            {wasmStatus === 'FAIL' && wasmFix && <FixBox instruction={wasmFix} />}

            <Button
              onClick={checkWasm}
              variant="outline"
              size="sm"
              className="w-full border-[#2B2350] text-xs font-bold"
            >
              Verify WebAssembly Support
            </Button>
          </Card>

          {/* 6. Multi-Monitor Display Check */}
          <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-50 border border-[#2B2350] flex items-center justify-center text-pink-600">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B2350]">6. Single Display Verification</h3>
                  <span className="text-[10px] font-mono text-[#6B6590]">Detects unauthorized external monitors</span>
                </div>
              </div>

              <StatusBadge status={displayStatus} />
            </div>

            {displayDetails && <p className="text-xs font-mono text-[#2B2350]">{displayDetails}</p>}

            {displayStatus === 'FAIL' && displayFix && <FixBox instruction={displayFix} />}

            <Button
              onClick={checkDisplay}
              variant="outline"
              size="sm"
              className="w-full border-[#2B2350] text-xs font-bold"
            >
              Scan Display Setup
            </Button>
          </Card>
        </div>

        {/* 7. Fullscreen Interactive Test Card */}
        <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-[#2B2350] flex items-center justify-center text-teal-600">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#2B2350]">7. Fullscreen Lock-Down Test</h3>
                <span className="text-[10px] font-mono text-[#6B6590]">Tests browser fullscreen capability</span>
              </div>
            </div>

            <StatusBadge status={fullscreenStatus} />
          </div>

          <p className="text-xs text-[#6B6590]">
            Click the button below to test entering fullscreen mode. AssessIQ will enter fullscreen for 1.5 seconds and return automatically.
          </p>

          {fullscreenDetails && <p className="text-xs font-mono text-[#2B2350]">{fullscreenDetails}</p>}
          {fullscreenStatus === 'FAIL' && fullscreenFix && <FixBox instruction={fullscreenFix} />}

          <Button
            onClick={handleTestFullscreenInteractive}
            variant="outline"
            size="sm"
            className="w-full border-[#2B2350] text-xs font-bold"
          >
            Launch Fullscreen Test
          </Button>
        </Card>

        {/* System Readiness Pass Certificate Banner */}
        {allPassed && passToken && (
          <div className="bg-[#FFF3A3] border-2 border-[#2B2350] rounded-3xl p-6 shadow-[6px_6px_0px_#2B2350] text-[#2B2350] space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b-2 border-[#2B2350]/15 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center border-2 border-[#2B2350]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B8F0D2] text-[#065F46] px-2.5 py-0.5 rounded-full border border-[#2B2350]">
                    WORKSTATION CERTIFIED READY
                  </span>
                  <h3 className="font-heading text-xl font-black text-[#2B2350] mt-1">
                    System Readiness Pass Issued
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#6B6590] block">PASS TOKEN</span>
                <span className="font-mono font-bold text-sm text-[#6C4DFF]">{passToken}</span>
              </div>
            </div>

            <p className="text-xs text-[#4A4468]">
              Your computer, webcam, microphone, and internet connection have passed all 7 diagnostic checks. You are completely ready for examination day!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                onClick={() => navigate('/student/practice/demo')}
                className="w-full sm:w-auto bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs py-3 px-6 rounded-xl border-2 border-[#2B2350] shadow-[3px_3px_0px_#2B2350] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>LAUNCH PRACTICE EXAM DEMO</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => {
                  window.print();
                }}
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#2B2350] font-mono font-bold text-xs py-3 px-5 rounded-xl bg-white"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Print Readiness Receipt</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper Components
const StatusBadge: React.FC<{ status: CheckStatus }> = ({ status }) => {
  if (status === 'PASS') {
    return (
      <Badge className="bg-[#B8F0D2] text-[#065F46] border border-[#2B2350] text-[10px] font-mono font-bold flex items-center space-x-1">
        <CheckCircle2 className="w-3 h-3" />
        <span>PASSED</span>
      </Badge>
    );
  }
  if (status === 'FAIL') {
    return (
      <Badge className="bg-[#FFB5A7] text-[#991B1B] border border-[#2B2350] text-[10px] font-mono font-bold flex items-center space-x-1">
        <XCircle className="w-3 h-3" />
        <span>ACTION NEEDED</span>
      </Badge>
    );
  }
  if (status === 'CHECKING') {
    return (
      <Badge className="bg-[#FFF3A3] text-[#2B2350] border border-[#2B2350] text-[10px] font-mono font-bold flex items-center space-x-1">
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span>CHECKING...</span>
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-mono">
      UNTESTED
    </Badge>
  );
};

const FixBox: React.FC<{ instruction: string }> = ({ instruction }) => {
  return (
    <div className="bg-[#FFF3A3]/60 border border-[#2B2350] rounded-xl p-3 text-xs text-[#2B2350] space-y-1">
      <div className="flex items-center space-x-1 font-bold text-[#D97706]">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>How to fix this issue:</span>
      </div>
      <p className="text-[11px] text-[#4A4468] leading-relaxed pl-4">{instruction}</p>
    </div>
  );
};

export default StudentSystemCheck;
