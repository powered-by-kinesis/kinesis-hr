'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { motion, useSpring, useMotionValue, useTransform, MotionValue } from 'framer-motion';

// A gentle multi-sine noise
function softNoise(angle: number, t: number) {
  return (
    (Math.sin(angle + t) + Math.sin(angle * 2 + t * 0.5) + Math.sin(angle * 0.5 + t * 1.5)) / 3
  );
}

const createBlobPath = (amp: number, t: number) => {
  const points = 128; // smoother
  const step = (Math.PI * 2) / points;
  const baseRadius = 64;
  let d = '';

  for (let i = 0; i < points; i++) {
    const theta = i * step;
    const noise = softNoise(theta * 2, t) * amp;
    const r = baseRadius + noise;
    const x = 100 + r * Math.cos(theta);
    const y = 100 + r * Math.sin(theta);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  d += ' Z';
  return d;
};

export function VoiceBlobSmoothCircle({
  isSpeaking = false,
  aiVolume,
}: {
  isSpeaking?: boolean;
  aiVolume?: number;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mounted, setMounted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micFrameRef = useRef<number | null>(null);

  const blobAmp = useSpring(10, { stiffness: 50, damping: 20 });
  const time = useMotionValue(0);

  const pathD = useTransform([blobAmp, time], (latestValues) => {
    const amp = latestValues[0] as number;
    const t = latestValues[1] as number;
    return createBlobPath(amp, t);
  });

  const startMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);

    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const updateVolume = () => {
      if (!analyserRef.current || !dataArrayRef.current) {
        return;
      }
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const avg = sum / dataArrayRef.current.length;
      blobAmp.set(5 + avg * 0.8);
      micFrameRef.current = requestAnimationFrame(updateVolume);
    };
    updateVolume();
  };

  const stopMic = () => {
    if (micFrameRef.current) cancelAnimationFrame(micFrameRef.current);
    audioContextRef.current?.close();
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startMic();
    } else {
      stopMic();
    }
    setIsRecording(!isRecording);
  };

  // Smoothly increment time for gentle motion
  useEffect(() => {
    setMounted(true);
    let t = 0;
    let raf: number;

    const tick = () => {
      t += 0.01; // Slower = smoother
      time.set(t);
      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(raf);
  }, [time]);

  useEffect(() => {
    console.log('isSpeaking:', isSpeaking, 'aiVolume:', aiVolume);
    if (isSpeaking && aiVolume !== undefined) {
      // Map AI volume (0-1) to a suitable amplitude range for the blob
      blobAmp.set(10 + aiVolume * 20); // Adjust multiplier as needed for visual effect
    } else {
      blobAmp.set(10); // Reset to a base amplitude when not speaking or no volume
    }
  }, [isSpeaking, aiVolume, blobAmp]);

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Glow ring */}
      <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-50 animate-pulse"></div>

      {/* Smooth wave blob */}
      {mounted && (
        <svg viewBox="0 0 200 200" className="absolute w-64 h-64">
          <motion.path fill="url(#grad)" d={pathD} />
          <defs>
            <radialGradient id="grad" r="50%" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.7" />
            </radialGradient>
          </defs>
        </svg>
      )}

      {/* Mic button */}
      <div className="absolute z-10 w-40 h-40  rounded-full shadow-lg transition-opacity duration-300 ease-in-out flex items-center justify-center">
        <div className="w-16 h-16 items-center justify-center flex bg-white rounded-full shadow-lg z-10">
          {isRecording ? <MicOff className="w-2 h-2" /> : <Mic className="w-5 h-5 text-gray-500" />}
        </div>
      </div>
    </div>
  );
}
