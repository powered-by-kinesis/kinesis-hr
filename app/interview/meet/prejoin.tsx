import { Button } from '@/components/ui/button';
import { useMediaDevices, usePersistentUserChoices } from '@livekit/components-react';
import { AudioCaptureOptions } from 'livekit-client';
import { useState } from 'react';

const PreJoinSection = ({
  onSubmit,
}: {
  onSubmit: (audioOptions: AudioCaptureOptions) => void;
}) => {
  const { userChoices } = usePersistentUserChoices();
  const audioDevices = useMediaDevices({ kind: 'audioinput' });
  const [audioOptions, setAudioOptions] = useState<AudioCaptureOptions>({
    deviceId: userChoices.audioDeviceId || undefined,
    echoCancellation: true,
    noiseSuppression: true,
  });

  return (
    <div className="mt-20 flex flex-col py-2">
      <p className="text-center">
        After you press the &quot;Start&quot; button, I will start asking questions one by one.{' '}
        <br />
        Answer calmly and as fully as possible.
      </p>
      <div className="flex flex-col gap-10 mt-10 items-center justify-center">
        <div className="flex gap-2">
          <select
            className="border rounded p-2"
            onChange={(e) => {
              const deviceId = e.target.value;
              setAudioOptions({
                deviceId: deviceId || undefined,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              });
            }}
          >
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h1 className="font-normal text-xl">Ready to start?</h1>
          <Button
            className="mt-4 cursor-pointer"
            onClick={() => {
              onSubmit(audioOptions);
            }}
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreJoinSection;
