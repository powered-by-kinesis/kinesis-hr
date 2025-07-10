'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';
import { ApplicantResponseDTO } from '@/types/applicant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationTable } from '@/components/organisms/application-table';
import { InterviewResultsTab } from './interview-results-tab';

interface CandidateDetailsClientProps {
    initialCandidate: ApplicantResponseDTO | null;
}

const getDocumentViewerUrl = (url: string | null): string => {
    if (!url) return '';
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
};

export function CandidateDetailsClient({ initialCandidate }: CandidateDetailsClientProps) {
    const router = useRouter();
    const [candidate, setCandidate] = React.useState(initialCandidate);
    const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
    const [activeTab, setActiveTab] = React.useState('info');

    React.useEffect(() => {
        setCandidate(initialCandidate);
    }, [initialCandidate]);

    const handleDataMutation = () => {
        router.refresh();
    };

    const resumeUrl = candidate?.applications?.[0]?.documents?.[0]?.document?.filePath;

    if (!candidate) {
        // This case should ideally be handled by the Server Component (e.g., notFound)
        // but as a fallback:
        return <div className="p-6">Candidate not found.</div>;
    }

    return (
        <div className={cn("flex flex-col gap-4 py-4 md:gap-6 md:py-6", !isAIAssistantMinimized && "lg:mr-96")}>
            <div className="px-4 lg:px-6">
                <div className="mb-6">
                    <Button variant="outline" size="sm" className="mb-4 cursor-pointer" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">
                        Candidate Details
                    </h1>
                </div>

                <Tabs defaultValue="info" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="info" className='cursor-pointer'>Candidate Info</TabsTrigger>
                        <TabsTrigger value="interview" className='cursor-pointer'>Interview Results</TabsTrigger>
                        <TabsTrigger value="applications" className='cursor-pointer'>Applications</TabsTrigger>
                    </TabsList>

                    <div className="relative mt-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {activeTab === 'info' && (
                                    <TabsContent value="info" forceMount className="w-full">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <Card className="lg:col-span-1">
                                                <CardContent className="p-6 text-center">
                                                    <h2 className="text-xl font-bold">{candidate.fullName}</h2>
                                                    <p className="text-sm text-muted-foreground mt-1">{candidate.email}</p>
                                                    <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                                                    <Button className="w-full mt-4 cursor-pointer">Request Interview</Button>
                                                </CardContent>
                                            </Card>
                                            <Card className="lg:col-span-2">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5" />
                                                        Resume/CV
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="aspect-[8.5/11] bg-gray-50 rounded-lg flex items-center justify-center relative">
                                                        {resumeUrl ? (
                                                            <iframe
                                                                src={getDocumentViewerUrl(resumeUrl)}
                                                                className="w-full h-full rounded-lg"
                                                                title={`${candidate.fullName}'s Resume`}
                                                            />
                                                        ) : (
                                                            <div className="text-center text-muted-foreground">
                                                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                                <p>No CV available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>
                                )}
                                {activeTab === 'interview' && (
                                    <TabsContent value="interview" forceMount>
                                        <InterviewResultsTab />
                                    </TabsContent>
                                )}
                                {activeTab === 'applications' && (
                                    <TabsContent value="applications" forceMount>
                                        <ApplicationTable
                                            data={candidate as ApplicantResponseDTO}
                                            onDeleteApplication={handleDataMutation}
                                            onEditApplication={() => handleDataMutation()}
                                        />
                                    </TabsContent>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </div>
        </div>
    );
} 