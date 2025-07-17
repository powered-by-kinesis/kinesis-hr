'use client';

import "@livekit/components-styles";
import {
    RoomContext,
    useVoiceAssistant,
    BarVisualizer,
    VoiceAssistantControlBar,
    RoomAudioRenderer,
} from "@livekit/components-react";
import { Room } from "livekit-client";
import { useState, useCallback, useEffect } from "react";
import { interviewRepository } from "@/repositories/interview-repository";
import { ValidationResponseDTO } from "@/types/interview/ValidationResponseDTO";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/logo";
import { Timer } from "lucide-react";
import Image from "next/image";

function InterviewPage() {
    const { state, audioTrack, agent } = useVoiceAssistant();

    // useEffect(() => {
    //     const checkMicStatus = async () => {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    //             // Immediately stop tracks (if you only needed permission)
    //             stream.getTracks().forEach(track => track.stop());
    //         } catch (err: any) {
    //             console.error("Mic permission error:", err);
    //         }
    //     };

    //     checkMicStatus();
    // }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
            <div className="h-40 w-full">
                <BarVisualizer state={state} barCount={5} trackRef={audioTrack} style={{ height: '100%', width: '100%' }} />
            </div>
            <p>Assistant State: {state}</p>

            <p className="mt-2 text-sm text-gray-600">Connected — voice agent is live 🎙️</p>
            <VoiceAssistantControlBar />
            <RoomAudioRenderer muted={false} />
        </div>
    );
}

const AccessDeniedPage = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-red-600">{message}</p>
        <p className="mt-4">Please ensure you are using a valid invitation link.</p>
    </div>
);

enum InterviewStep {
    WELCOME = 1,
    PERMISSION_CHECK = 2,
    INTERVIEW = 3,
}

export default function Page() {
    const [room] = useState(() => new Room());
    const [interviewData, setInterviewData] = useState<ValidationResponseDTO['data'] | null>(null);
    const searchParams = useSearchParams();
    const token = searchParams.get('token')
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentStep, setCurrentStep] = useState<InterviewStep>(InterviewStep.INTERVIEW);

    const validateInvitationAndConnectRoom = useCallback(async () => {
        try {
            if (!token) {
                setErrorMessage("No token provided in the URL. Please use a valid invitation link.");
                setLoading(false);
                return;
            }
            const validationData = await interviewRepository.validateInvitationByToken(token);
            if (!validationData.success) {
                setErrorMessage("Invalid or expired invitation link. Please check your email for a new link.");
            }
            setInterviewData(validationData.data);

            const data = await interviewRepository.createLivekitRoom({
                invitationInterviewId: validationData.data.id,
                roomName: `Interview-${Date.now()}`,
            })
            await room.connect(data.serverUrl, data.roomToken, { autoSubscribe: true });

            setLoading(false);
        } catch (error) {
            console.error("Validation error:", error);
            setErrorMessage("Failed to validate invitation. Please try again.");
            setLoading(false);

            return;
        }
    }, [token, room]);

    useEffect(() => {

        validateInvitationAndConnectRoom();

        return () => {
            room.disconnect();
        };
    }, [room]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <p>Loading interview data and validating access...</p>
            </div>
        );
    }
    if (errorMessage) {
        return <AccessDeniedPage message={errorMessage} />;
    }

    return (
        <RoomContext.Provider value={room}>
            <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 flex py-5 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
                        <div className="flex items-center gap-2">
                            <Logo width={7} height={7} />
                        </div>
                        <div className="flex items-center gap-4">
                            {currentStep === InterviewStep.INTERVIEW && <Timer />}
                        </div>
                    </div>
                </header>

                <div className='flex-1 flex items-center justify-center p-4'>
                    {currentStep === InterviewStep.WELCOME && (
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-8 rounded-lg max-w-5xl mx-auto">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/welcome_image.png"
                                    alt="Welcome Illustration"
                                    width={380}
                                    height={465}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                <div className="p-8 rounded-lg text-left font-poppins text-base leading-relaxed">
                                    <p className="mb-4">
                                        Halo, {interviewData?.applicant.fullName || 'there'}! 👋<br />
                                        Selamat! Kamu sudah sampai di tahap interview.
                                    </p>
                                    <p className="mb-4">
                                        Aku Ken, asisten AI yang akan mewawancarai kamu hari ini.<br />
                                        Sebelum kita mulai, pastikan:
                                    </p>
                                    <ul className="list-disc list-inside mb-4">
                                        <li>Koneksi internet kamu stabil</li>
                                        <li>Kamu berada di ruangan sendiri, tanpa bantuan siapa pun</li>
                                        <li>Interview ini akan berlangsung selama 17 menit.</li>
                                    </ul>
                                    <p>
                                        Setelah kamu menekan tombol "Mulai", aku akan mulai memberikan pertanyaan satu per satu.<br />
                                        Jawablah dengan tenang dan semaksimal mungkin ya. Semangat! 💪
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setCurrentStep(InterviewStep.INTERVIEW)}
                                    className={cn(
                                        "cursor-pointer",
                                        "mt-8 px-6 py-3",
                                    )}
                                >
                                    Next
                                </Button>
                                {errorMessage && <p className="text-red-500 mt-4">Error: {errorMessage}</p>}
                            </div>

                        </div>
                    )}
                </div>

                {currentStep === InterviewStep.INTERVIEW && <div>
                    <InterviewPage />
                </div>}
            </div>

        </RoomContext.Provider >
    );
}
