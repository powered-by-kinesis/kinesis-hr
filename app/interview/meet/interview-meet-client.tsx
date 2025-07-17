'use client';

import { Logo } from "@/components/atoms/logo";
import { AudioCaptureOptions } from "livekit-client";
import { useEffect, useState } from "react";
import '@livekit/components-styles';
import { ValidationResponseDTO } from "@/types/interview/ValidationResponseDTO";
import { Loading } from "@/components/molecules/loading";
import { interviewRepository } from "@/repositories/interview-repository";
import { toast } from "sonner";
import InterviewSection from "./interview-section";
import PreJoinSection from "./prejoin";

export default function InterviewMeetClient({ token }: { token?: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [interviewData, setInterviewData] = useState<ValidationResponseDTO['data'] | null>(null);
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
                setInterviewData(response.data);
            }
            setLoading(false);
        })();
    }, []);

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
            });
            setAudioOptions(audioOptions);
        } catch (error) {
            console.error("Error creating Livekit room:", error);
            toast.error("Failed to create Livekit room. Please try again.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 flex py-5 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-filter supports-[backdrop-filter]:bg-background/60">
                <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
                    <div className="flex items-center gap-2">
                        <Logo width={7} height={7} />
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Future Timer */}
                    </div>
                </div>
            </header>
            {
                loading ? <Loading /> : error ? <div>Error: {error}</div> : interviewData && (
                    <main>
                        {
                            (room && audioOptions) ? (
                                <InterviewSection audioOptions={audioOptions} roomData={room} />
                            ) : (
                                <PreJoinSection onSubmit={onClickStart} />
                            )
                        }
                    </main>
                )
            }
        </div>
    );
}
