'use client';

import * as React from 'react';
import { Logo } from '@/components/atoms/logo';
import { Timer } from '@/components/molecules/timer/timer';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { VoiceBlobSmoothCircle } from '@/components/molecules/listening-wave/listening-wave';
import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { interviewRepository } from '@/repositories/interview-repository';
import { InterviewResponseDTO } from '@/types/interview/InterviewResponseDTO';
import { cn } from '@/lib/utils'; // Import cn
import Image from 'next/image'; // Import Image component
import { ValidationResponseDTO } from '@/types/interview/ValidationResponseDTO';

// Define steps for the interview process
enum InterviewStep {
    WELCOME = 1,
    PERMISSION_CHECK = 2,
    INTERVIEW = 3,
}

// Define a simple error page component
const AccessDeniedPage = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-red-600">{message}</p>
        <p className="mt-4">Please ensure you are using a valid invitation link.</p>
    </div>
);

export default function AiInterviewPage() {
    const { id } = useParams();
    const interviewIdNum = Number(id);
    const searchParams = useSearchParams(); // Initialize useSearchParams
    const token = searchParams.get('token'); // Get token from URL

    const [isRecording, setIsRecording] = React.useState(false);
    const [elevenLabsError, setElevenLabsError] = React.useState<Error | null>(null);
    const [interviewData, setInterviewData] = React.useState<InterviewResponseDTO | null>(null); // Corrected type here
    const [isLoading, setIsLoading] = React.useState(true);
    const [isValidToken, setIsValidToken] = React.useState(false); // State for token validation
    const [validationError, setValidationError] = React.useState<string | null>(null); // State for validation errors
    const [validationResponseData, setValidationResponseData] = React.useState<ValidationResponseDTO | null>(null); // State for validation response data
    const [currentStep, setCurrentStep] = React.useState<InterviewStep>(InterviewStep.WELCOME); // New state for managing steps

    const [aiVolume, setAiVolume] = React.useState(0);

    const conversation = useConversation({
        onConnect: () => {
            console.log('Connected to Eleven Labs');
            setElevenLabsError(null); // Clear any previous errors on successful connection
        },
        onDisconnect: () => console.log('Disconnected from Eleven Labs'),
        onMessage: (message) => console.log('Message from Eleven Labs1:', message),
        onError: (error) => {
            setElevenLabsError(new Error(error));
        },
    });

    const getSignedUrl = async (): Promise<string> => {
        const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
        if (!agentId) {
            throw new Error('NEXT_PUBLIC_AGENT_ID is not defined');
        }
        const response = await fetch(`/api/elevenlab/get-signed-url?agent_id=${agentId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to get signed URL: ${response.statusText}`);
        }
        const { signedUrl } = await response.json();
        return signedUrl;
    };

    // Modified startInterview to only handle Eleven Labs connection
    const startInterview = useCallback(async () => {
        try {
            const signedUrl = await getSignedUrl();
            const skills = (interviewData?.skills as Array<{ name: string }>).map(skill => skill.name).join(', ') || 'No skills specified';
            await conversation.startSession({
                connectionType: 'websocket',
                signedUrl, dynamicVariables: {
                    skills_list: skills,
                    interview_time_limit: 5,
                    email: validationResponseData?.data.applicant.email || '',
                    applicant_name: validationResponseData?.data.applicant.fullName || 'Applicant',
                    applicantId: validationResponseData?.data.applicant.id || '',
                    position: interviewData?.jobPost?.title || '',
                },
            });
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start interview:', error);
            setElevenLabsError(new Error('Failed to connect to interview service. Please try again.'));
        }
    }, [conversation, interviewData]);

    const stopInterview = useCallback(async () => {
        await conversation.endSession();
        setIsRecording(false);
    }, [conversation]);

    // New function to request microphone permission and then start the interview
    const requestMicrophonePermissionAndStartInterview = useCallback(async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setCurrentStep(InterviewStep.INTERVIEW); // Move to the interview step
            await startInterview(); // Call the modified startInterview
        } catch (error) {
            console.error('Microphone permission denied or failed to start interview:', error);
            setValidationError('Microphone permission is required to proceed with the interview.');
            // Optionally, set currentStep back to PERMISSION_CHECK or show a specific error UI for permission
        }
    }, [startInterview]);

    React.useEffect(() => {
        const validateAndFetchInterview = async () => {
            if (!interviewIdNum || isNaN(interviewIdNum)) {
                setValidationError('Invalid interview ID provided.');
                setIsLoading(false);
                return;
            }

            if (!token) {
                setValidationError('Invitation token is missing.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // Validate token
                const validationResult = await interviewRepository.validateInvitation(token, interviewIdNum);

                if (!validationResult.success) {
                    setValidationError('Failed to validate invitation.');
                    setIsValidToken(false);
                    return;
                }

                setIsValidToken(true);
                setValidationResponseData(validationResult);

                // Fetch interview data only if token is valid
                const data = await interviewRepository.getInterviewById(interviewIdNum);
                setInterviewData(data);

            } catch (error) {
                console.error('Error during validation or fetching interview:', error);
                setValidationError('An unexpected error occurred during access validation.');
                setElevenLabsError(new Error('Failed to load interview data.'));
            } finally {
                setIsLoading(false);
            }
        };

        validateAndFetchInterview();
    }, [interviewIdNum, token]); // Depend on interviewIdNum and token


    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <p>Loading interview data and validating access...</p>
            </div>
        );
    }

    if (validationError) {
        return <AccessDeniedPage message={validationError} />;
    }

    if (!isValidToken) {
        return <AccessDeniedPage message="You do not have permission to access this interview." />;
    }

    return (
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
                            <div className="p-8 rounded-lg text-left text-white font-poppins text-base leading-relaxed">
                                <p className="mb-4">
                                    Halo, {validationResponseData?.data.applicant.fullName || 'there'}! 👋<br />
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
                                onClick={() => setCurrentStep(InterviewStep.PERMISSION_CHECK)}
                                className={cn(
                                    "cursor-pointer",
                                    "mt-8 px-6 py-3",
                                    elevenLabsError !== null && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={elevenLabsError !== null}
                            >
                                Next
                            </Button>
                            {validationError && <p className="text-red-500 mt-4">Error: {validationError}</p>}
                        </div>

                    </div>
                )}

                {currentStep === InterviewStep.PERMISSION_CHECK && (
                    <div className="flex flex-col items-center justify-center text-center">
                        <h1 className="text-3xl font-bold mb-4">Microphone Permission Check</h1>
                        <p className="text-lg mb-8">
                            To proceed with the interview, we need access to your microphone.
                            Please grant permission when prompted.
                        </p>
                        <Button
                            onClick={requestMicrophonePermissionAndStartInterview}
                            disabled={elevenLabsError !== null}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg text-xl"
                        >
                            Grant Microphone Access & Start Interview
                        </Button>
                        {validationError && <p className="text-red-500 mt-4">Error: {validationError}</p>}
                        {/* back button */}
                        <Button
                            onClick={() => setCurrentStep(InterviewStep.WELCOME)}
                            className="absolute left-10 bottom-10 px-4 py-2 bg-gray-200 text-black rounded-lg"
                        >
                            Back
                        </Button>
                    </div>
                )}

                {currentStep === InterviewStep.INTERVIEW && (
                    <>
                        {conversation.status === 'connecting' && <p>Connecting...</p>}
                        {conversation.status === 'connected' && conversation.isSpeaking && <p>AI is speaking...</p>}
                        {conversation.status === 'connected' && !conversation.isSpeaking && <p>AI is listening...</p>}
                        {conversation.status === 'disconnected' && <p>Disconnected.</p>}
                        {elevenLabsError && <p className="text-red-500">Error: {elevenLabsError.message}</p>}

                        <VoiceBlobSmoothCircle isSpeaking={conversation.isSpeaking} aiVolume={aiVolume} />

                        <div className="absolute bottom-8 flex gap-4">
                            <Button
                                onClick={startInterview} // This button should ideally be removed or re-purposed if interview starts automatically
                                disabled={conversation.status === 'connected' || elevenLabsError !== null}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                {isRecording ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
                                {isRecording ? 'Recording...' : 'Start Interview'}
                            </Button>
                            <Button
                                onClick={stopInterview}
                                disabled={!isRecording || conversation.status !== 'connected'}
                                className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
                            >
                                Stop Interview
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
