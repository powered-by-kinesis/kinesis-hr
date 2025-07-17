'use client';
import { Logo } from "@/components/atoms/logo";
import { AudioTrack, AudioVisualizer, BarVisualizer, ParticipantPlaceholder, PreJoin, RoomAudioRenderer, RoomContext, useMaybeRoomContext, useMediaDevices, usePersistentUserChoices, usePreviewTracks, useVoiceAssistant, VideoTrack, VoiceAssistantControlBar } from "@livekit/components-react";
import { AudioCaptureOptions, DataPacket_Kind, facingModeFromLocalTrack, LocalAudioTrack, LocalVideoTrack, Room, RoomEvent, Track, TranscriptionSegment } from "livekit-client";
import { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import '@livekit/components-styles';
import { ValidationResponseDTO } from "@/types/interview/ValidationResponseDTO";
import { Loading } from "@/components/molecules/loading";
import { useSearchParams } from "next/navigation";
import { interviewRepository } from "@/repositories/interview-repository";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [interviewData, setInterviewData] = useState<ValidationResponseDTO['data'] | null>(null);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [room, setRoom] = useState<{ serverUrl: string, roomToken: string } | null>(null);
    const [audioOptions, setAudioOptions] = useState<AudioCaptureOptions>();

    useEffect(() => {
        if (!token) {
            setError("No token provided in the URL. Please use a valid invitation link.");
            setLoading(false);
            return;
        }

        (async () => {
            const response = await interviewRepository.validateInvitationByToken(token);
            if (!response.success) {
                setError("Invalid or expired invitation link. Please check your email for a new link.");
            } else {
                if (response)
                    setInterviewData(response.data);
            }
            setLoading(false);
        })()
    }, [])

    const onClickStart = async (audioOptions: AudioCaptureOptions) => {
        try {
            if (!interviewData) {
                toast.error("Interview data is not available. Please try again.");
                return;
            }
            const response = await interviewRepository.createLivekitRoom({
                invitationInterviewId: interviewData.id || 0,
                roomName: `Interview-${Date.now()}`,
            });
            setRoom({
                serverUrl: response.serverUrl,
                roomToken: response.roomToken,
            })
            setAudioOptions(audioOptions);

        } catch (error) {
            console.error("Error creating Livekit room:", error);
            toast.error("Failed to create Livekit room. Please try again.");
        }
    }

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 flex py-5 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
                        <div className="flex items-center gap-2">
                            <Logo width={7} height={7} />
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Placeholder for future components like Timer */}
                        </div>
                    </div>
                </header>
                {
                    loading ? <Loading /> : error ? <div>Error: {error}</div> : interviewData && (
                        <main>
                            {
                                (room && audioOptions) ?
                                    <InterviewSection audioOptions={audioOptions} interviewData={interviewData} roomData={room} /> :
                                    <PreJoinSection onSubmit={onClickStart} />
                            }
                        </main>
                    )
                }
            </div>

        </>
    )
}

const InterviewSection = ({ audioOptions, interviewData, roomData }: { audioOptions: AudioCaptureOptions, interviewData: ValidationResponseDTO['data'], roomData: { serverUrl: string, roomToken: string } }) => {
    const [room] = useState(() => new Room({
        audioCaptureDefaults: audioOptions,
    }))
    const [isConnected, setIsConnected] = useState(false);
    const [isEndCall, setIsEndCall] = useState(false);

    const handleEndCall = () => {
        setIsEndCall(true);
    }

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                await room.connect(roomData.serverUrl, roomData.roomToken, {
                    autoSubscribe: true,
                });

                room.localParticipant.setMicrophoneEnabled(true);
                if (isMounted) {
                    setIsConnected(true);
                }
            } catch (err) {
                console.error("Failed to connect to room:", err);
            }
        })();

        return () => {
            isMounted = false;
            if (room.state === "connected") {
                room.disconnect();
            }
        };
    }, [roomData, room]);

    if (!isConnected) {
        return <Loading />;
    }

    return (
        <RoomContext.Provider value={room}>
            {
                isEndCall ? (
                    <div className="flex flex-col min-h-screen items-center justify-center">
                        <h1 className="text-2xl font-bold">Interview Ended</h1>
                        <p className="mt-4">Thank you for participating in the interview.</p>
                    </div>
                ) : (
                    <InsideSection onEndCall={handleEndCall} />
                )
            }
        </RoomContext.Provider>
    )
}

const InsideSection = ({ onEndCall }: { onEndCall: () => void }) => {
    const room = useMaybeRoomContext();
    const { state, audioTrack } = useVoiceAssistant();

    useEffect(() => {
        if (!room) {
            return;
        }

        const onDisconnected = () => {
            onEndCall();
        }

        room.on(RoomEvent.Disconnected, onDisconnected);

        if (room.engine) {
            room.engine.on('disconnected', onDisconnected);
        }

        return () => {
            room.off(RoomEvent.Disconnected, onDisconnected);
            if (room.engine) {
                room.engine.off('disconnected', onDisconnected);
            }
        };
    }, [room]);

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5">
                <div className="mt-20">
                    <Transcriptions />
                </div>
                <div className="h-40 w-full">
                    <BarVisualizer style={{ height: '100%', width: '100%' }} state={state} barCount={5} trackRef={audioTrack} />
                </div>
                <p className="text-center">{state}</p>
                <RoomAudioRenderer />
                <VoiceAssistantControlBar controls={{
                    leave: false,
                    microphone: true
                }} />
            </div>
        </div>
    )
}

function Transcriptions() {
    const room = useMaybeRoomContext();
    const { state } = useVoiceAssistant();
    const [transcriptions, setTranscriptions] = useState<{ [id: string]: TranscriptionSegment }>({});

    useEffect(() => {
        if (!room) {
            return;
        }

        const updateTranscriptions = (
            segments: TranscriptionSegment[],
        ) => {
            if (state === 'speaking') {
                const tcs: { [id: string]: TranscriptionSegment } = {}

                for (const segment of segments) {
                    tcs[segment.id] = segment;
                }
                setTranscriptions(tcs)
            }
        };

        room.on(RoomEvent.TranscriptionReceived, updateTranscriptions);
        return () => {
            room.off(RoomEvent.TranscriptionReceived, updateTranscriptions);
        };
    }, [room, state]);

    return (
        <div className="flex flex-col items-center">
            {Object.values(transcriptions)
                .sort((a, b) => a.firstReceivedTime - b.firstReceivedTime)
                .map((segment) => (
                    <p key={segment.id} className="text-center max-w-xl mb-2 px-4 break-words">
                        {segment.text}
                    </p>
                ))}
        </div>
    )
}

const PreJoinSection = ({ onSubmit }: { onSubmit: (audioOptions: AudioCaptureOptions) => void }) => {
    const { userChoices } = usePersistentUserChoices();
    const audioDevices = useMediaDevices({ kind: "audioinput" });
    const [audioOptions, setAudioOptions] = useState<AudioCaptureOptions>({
        deviceId: userChoices.audioDeviceId || undefined,
        echoCancellation: true,
        noiseSuppression: true,
    })



    return (
        <div className="mt-20 flex flex-col py-2">
            <p className="text-center">
                After you press the "Start" button, I will start asking questions one by one. <br />
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
                    <Button className="mt-4 cursor-pointer" onClick={() => { onSubmit(audioOptions); }}>
                        Start Interview
                    </Button>
                </div>
            </div>
        </div>
    );
}
