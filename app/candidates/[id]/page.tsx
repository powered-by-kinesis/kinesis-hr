/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import {
    Play,
    Star,
    Badge as BadgeIcon,
    ArrowLeft,
    FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { useParams, useRouter } from 'next/navigation';
import { Loading } from '@/components/molecules/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { applicantRepository } from '@/repositories/applicant-repository';
import { ApplicantResponseDTO } from '@/types/applicant';
import { ApplicationTable } from '@/components/organisms/application-table';

// Skill assessment data structure
interface SkillAssessment {
    name: string;
    level: string;
    rating: 'Senior' | 'Experienced' | 'Excellent' | 'Good' | 'Basic';
    icon?: React.ReactNode;
}

// Mock skill assessments based on the image
const mockSkillAssessments: SkillAssessment[] = [
    {
        name: 'B2B sales',
        level: '8+ yrs experience',
        rating: 'Senior',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'Human Data Management',
        level: '2+ yrs experience',
        rating: 'Senior',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'Hubspot CRM',
        level: '4+ yrs experience',
        rating: 'Experienced',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'SaaS solutions',
        level: '8+ yrs experience',
        rating: 'Experienced',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'Soft skills',
        level: 'C1 (Excellent)',
        rating: 'Excellent',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
];

function getRatingColor(rating: string): string {
    switch (rating) {
        case 'Senior':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Experienced':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Excellent':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Good':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

const getDocumentViewerUrl = (url: string | null): string => {
    if (!url) return '';
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
};

export default function CandidateDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(true);
    const [candidate, setCandidate] = React.useState<ApplicantResponseDTO | null>(null);
    const [isAIAssistantMinimized, setIsAIAssistantMinimized] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('info');

    // Extract resume URL from the application documents
    const resumeUrl = candidate?.applications?.[0]?.documents?.[0]?.document?.filePath;

    const fetchData = React.useCallback(async () => {
        try {
            const resp = await applicantRepository.getApplicantById(Number(params.id));
            setCandidate(resp as unknown as ApplicantResponseDTO);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching candidate:', error);
            setIsLoading(false);
        }
    }, [params.id]);

    // Fetch data on component mount
    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background">
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset className="md:peer-data-[variant=inset]:m-0">
                    <SiteHeader />
                    <motion.div
                        className="flex flex-1 flex-col"
                        layout
                        transition={{
                            layout: { duration: 0.3, ease: "easeInOut" }
                        }}
                    >
                        <motion.div
                            className="flex flex-1 flex-col gap-2"
                            layout
                        >
                            <motion.div
                                className={cn(
                                    "flex flex-col gap-4 py-4 md:gap-6 md:py-6",
                                    !isAIAssistantMinimized && "lg:mr-96"
                                )}
                                layout
                                transition={{
                                    layout: { duration: 0.3, ease: "easeInOut" }
                                }}
                            >
                                <motion.div
                                    className="px-4 lg:px-6"
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut"
                                    }}
                                >
                                    <motion.div
                                        className="mb-6"
                                        layout
                                    >
                                        <Button variant="outline" size="sm" className="mb-4 cursor-pointer" onClick={() => router.back()}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <motion.h1
                                            className="text-3xl font-bold"
                                            layout
                                        >
                                            Candidate Details
                                        </motion.h1>
                                    </motion.div>

                                    <Tabs
                                        defaultValue="info"
                                        className="space-y-4"
                                        onValueChange={setActiveTab}
                                    >
                                        <TabsList className="grid grid-cols-3">
                                            <TabsTrigger value="info" className='cursor-pointer'>Candidate Info</TabsTrigger>
                                            <TabsTrigger value="interview" className='cursor-pointer'>Interview Results</TabsTrigger>
                                            <TabsTrigger value="applications" className='cursor-pointer'>Applications</TabsTrigger>
                                        </TabsList>

                                        {/* Tabs content wrapper */}
                                        <div className="relative">
                                            <AnimatePresence mode="wait">
                                                {/* Info Tab */}
                                                {activeTab === "info" && (
                                                    <motion.div
                                                        key="info-content"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="absolute w-full"
                                                    >
                                                        <TabsContent value="info" forceMount>
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                {/* Basic Info Card */}
                                                                <motion.div
                                                                    className="lg:col-span-1"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        duration: 0.4,
                                                                        delay: 0.1
                                                                    }}
                                                                >
                                                                    <Card>
                                                                        <CardContent className="p-6">
                                                                            {/* Profile Picture and Basic Info */}
                                                                            <div className="text-center mb-6">
                                                                                <div className="mb-4">
                                                                                    <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                                                                                        {candidate?.fullName}
                                                                                    </h2>
                                                                                </div>

                                                                                <div className="space-y-2 mb-4">
                                                                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                                                        {candidate?.email}
                                                                                    </div>
                                                                                </div>

                                                                                <div className="space-y-2 mb-4">
                                                                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                                                        {candidate?.phone}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Request Interview Button */}
                                                                            <Button className="w-full cursor-pointer">
                                                                                Request interview
                                                                            </Button>
                                                                        </CardContent>
                                                                    </Card>
                                                                </motion.div>

                                                                {/* CV Preview Card */}
                                                                <motion.div
                                                                    className="lg:col-span-2"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        duration: 0.4,
                                                                        delay: 0.2
                                                                    }}
                                                                >
                                                                    <Card>
                                                                        <CardHeader>
                                                                            <CardTitle className="flex items-center gap-2">
                                                                                <FileText className="h-5 w-5" />
                                                                                Resume/CV
                                                                            </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                            <div className="aspect-[8.5/11] bg-gray-50 rounded-lg flex items-center justify-center relative">
                                                                                {resumeUrl ? (
                                                                                    <div className="w-full h-full relative">
                                                                                        <iframe
                                                                                            src={getDocumentViewerUrl(resumeUrl)}
                                                                                            className="w-full h-full rounded-lg"
                                                                                            title={`${candidate?.fullName}'s Resume`}
                                                                                        />
                                                                                        <div className="absolute bottom-4 right-4 flex gap-2">
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                    if (resumeUrl) {
                                                                                                        window.open(resumeUrl, '_blank');
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <FileText className="h-4 w-4 mr-2" />
                                                                                                Open
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-center text-muted-foreground">
                                                                                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                                                        <p>No CV available</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                </motion.div>
                                                            </div>
                                                        </TabsContent>
                                                    </motion.div>
                                                )}

                                                {/* Interview Tab */}
                                                {activeTab === "interview" && (
                                                    <motion.div
                                                        key="interview-content"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="absolute w-full"
                                                    >
                                                        <TabsContent value="interview" forceMount>
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                {/* Skills Assessment Card */}
                                                                <motion.div
                                                                    className="lg:col-span-1"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        duration: 0.4,
                                                                        delay: 0.1
                                                                    }}
                                                                >
                                                                    <Card>
                                                                        <CardHeader>
                                                                            <CardTitle>Skills Assessment</CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent className="space-y-4">
                                                                            {mockSkillAssessments.map((skill, index) => (
                                                                                <div
                                                                                    key={index}
                                                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        {skill.icon}
                                                                                        <div>
                                                                                            <p className="font-medium text-sm">{skill.name}</p>
                                                                                            <p className="text-xs text-muted-foreground">{skill.level}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <Badge variant="secondary" className={getRatingColor(skill.rating)}>
                                                                                        {skill.rating}
                                                                                    </Badge>
                                                                                </div>
                                                                            ))}
                                                                        </CardContent>
                                                                    </Card>
                                                                </motion.div>

                                                                {/* Interview Recording Card */}
                                                                <motion.div
                                                                    className="lg:col-span-2"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        duration: 0.4,
                                                                        delay: 0.2
                                                                    }}
                                                                >
                                                                    {/* Recording Section */}
                                                                    <Card className="mb-6">
                                                                        <CardHeader>
                                                                            <CardTitle>Interview Summary</CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent className="space-y-4">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                {/* Video Player */}
                                                                                <div>
                                                                                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 opacity-50"></div>
                                                                                        <Button
                                                                                            variant="secondary"
                                                                                            size="lg"
                                                                                            className="relative z-10 rounded-full w-16 h-16 p-0"
                                                                                        >
                                                                                            <Play className="h-6 w-6 ml-1" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Transcript */}
                                                                                <div className="space-y-2">
                                                                                    <div className="bg-gray-50 rounded-lg p-6 text-center h-full flex items-center justify-center">
                                                                                        <div className="text-muted-foreground">
                                                                                            <p className="text-sm">Transcript will be available soon</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>

                                                                    {/* AI Analysis Card */}
                                                                    <Card>
                                                                        <CardHeader>
                                                                            <CardTitle>AI Analysis</CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent className="space-y-6">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                                                        <span className="font-medium">Overall Score</span>
                                                                                    </div>
                                                                                    <div className="text-2xl font-bold text-primary">100/100</div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Star className="h-4 w-4 text-blue-500" />
                                                                                        <span className="font-medium">Match Score</span>
                                                                                    </div>
                                                                                    <div className="text-2xl font-bold text-primary">100/100</div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Key Strengths */}
                                                                            {true && (
                                                                                <div className="space-y-2">
                                                                                    <h4 className="font-medium">Key Strengths</h4>
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        {['test', 'test2'].map((strength, index) => (
                                                                                            <Badge key={index} variant="secondary">
                                                                                                {strength}
                                                                                            </Badge>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </CardContent>
                                                                    </Card>
                                                                </motion.div>
                                                            </div>
                                                        </TabsContent>
                                                    </motion.div>
                                                )}

                                                {/* Applications Tab */}
                                                {activeTab === "applications" && (
                                                    <motion.div
                                                        key="applications-content"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="absolute w-full"
                                                    >
                                                        <TabsContent value="applications" forceMount>
                                                            <ApplicationTable data={candidate as ApplicantResponseDTO} />
                                                        </TabsContent>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </Tabs>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </SidebarInset>
            </SidebarProvider>

            <AIAssistantSidebar
                isMinimized={isAIAssistantMinimized}
                onMinimize={() => setIsAIAssistantMinimized(true)}
                onMaximize={() => setIsAIAssistantMinimized(false)}
            />
        </div>
    );
}
