'use client';
import { Loading } from "@/components/molecules/loading";
import { BarVisualizer, RoomAudioRenderer, RoomContext, useMaybeRoomContext, useVoiceAssistant, VoiceAssistantControlBar } from "@livekit/components-react";
import { AudioCaptureOptions, Room, RoomEvent, TranscriptionSegment } from "livekit-client";
import { useEffect, useState } from "react";

const InterviewSection = ({ audioOptions, roomData }: { audioOptions: AudioCaptureOptions, roomData: { serverUrl: string, roomToken: string } }) => {
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

export default InterviewSection;