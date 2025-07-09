'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { CandidatesTable } from '@/components/organisms/candidates-table';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { Loading } from '@/components/molecules/loading';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { JobDetailModal } from './job-detail-modal';

// Import repositories and types
import { jobPostRepository } from '@/repositories';
import { JobPostResponseDTO } from '@/types/job-post';
import { ApplicantResponseDTO } from '@/types/applicant';
import { Stage } from '@/constants/enums/stage';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';

export default function JobDetailPage() {
    const params = useParams();
    const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
    const router = useRouter();
    // State for storing fetched data
    const [jobPostsData, setJobPostsData] = React.useState<JobPostResponseDTO[]>([]);
    const [candidatesApplied, setCandidatesApplied] = React.useState<ApplicantResponseDTO[]>([]);
    const [candidatesHired, setCandidatesHired] = React.useState<ApplicantResponseDTO[]>([]);
    const [candidatesAI, setCandidatesAI] = React.useState<ApplicantResponseDTO[]>([]);
    const [candidatesReview, setCandidatesReview] = React.useState<ApplicantResponseDTO[]>([]);
    const [candidatesOffer, setCandidatesOffer] = React.useState<ApplicantResponseDTO[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
    const [activeTab, setActiveTab] = React.useState('applied');

    const transformJobPostToCandidates = (jobPost: JobPostResponseDTO, filter?: Stage) => {
        return jobPost.applications?.filter((application) => application.currentStage === filter).map((application) => ({
            ...application.applicant,
            appliedAt: application.appliedAt,
            phone: application.applicant.phone || null,
            resumeUrl: application?.documents[0]?.document.filePath || null,
            stage: application.currentStage,
            // applications: [{
            //     id: application.id,
            //     jobPostId: jobPost.id,
            //     applicantId: application.applicant.id,
            //     currentStage: application.currentStage,
            //     expectedSalary: application.expectedSalary,
            //     appliedAt: application.appliedAt,
            //     notes: application.notes || null,
            //     jobPost: {
            //         id: jobPost.id,
            //         title: jobPost.title,
            //         description: jobPost.description,
            //         location: jobPost.location,
            //         employmentType: jobPost.employmentType,
            //         status: jobPost.status,
            //         department: jobPost.department,
            //         salaryMin: jobPost.salaryMin ? Number(jobPost.salaryMin) : null,
            //         salaryMax: jobPost.salaryMax ? Number(jobPost.salaryMax) : null,
            //         currency: jobPost.currency,
            //         salaryType: jobPost.salaryType,
            //     }
            // }]
        })) || [];
    }

    // Function to fetch all data
    const fetchData = React.useCallback(async () => {
        try {
            const jobPostId = params.id as string;
            setIsLoading(true);
            const jobPost = await jobPostRepository.getJobPostById(Number(jobPostId));

            setJobPostsData([jobPost]);
            setCandidatesApplied(transformJobPostToCandidates(jobPost, Stage.APPLIED));
            setCandidatesHired(transformJobPostToCandidates(jobPost, Stage.HIRED));
            setCandidatesAI(transformJobPostToCandidates(jobPost, Stage.AI_SCREENING));
            setCandidatesReview(transformJobPostToCandidates(jobPost, Stage.REVIEW));
            setCandidatesOffer(transformJobPostToCandidates(jobPost, Stage.OFFER));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [params.id]);

    // Fetch data on component mount
    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <div className="relative m-0 p-0">
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
                        <div className="flex flex-1 flex-col">
                            <div className="@container/main flex flex-1 flex-col gap-2">
                                {/* Main content with right margin to accommodate AI Assistant */}
                                <div className={cn("flex flex-col gap-4 py-4 md:gap-6 md:py-6", !isAIAssistantMinimized && "mr-96")}>
                                    <div className="px-4 lg:px-6">
                                        <div className="mb-6 flex flex-col gap-4">
                                            <div>
                                                <Button variant="outline" size="sm" className="mt-2 cursor-pointer" onClick={() => router.back()}>
                                                    <ArrowLeft className="w-4 h-4" />
                                                    Back
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <h1 className="text-3xl font-bold text-foreground">{jobPostsData[0]?.title || 'Job Post Detail'}</h1>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 cursor-pointer"
                                                    onClick={() => setIsDetailModalOpen(true)}
                                                >
                                                    View Description
                                                </Button>
                                            </div>
                                        </div>

                                        <Tabs defaultValue="applied" onValueChange={setActiveTab}>
                                            <TabsList className="grid grid-cols-5">
                                                <TabsTrigger value="applied" className="flex items-center gap-2 cursor-pointer">
                                                    Applied
                                                </TabsTrigger>
                                                <TabsTrigger value="ai-screening" className="flex items-center gap-2 cursor-pointer">
                                                    AI Screening
                                                </TabsTrigger>
                                                <TabsTrigger value="review" className="flex items-center gap-2 cursor-pointer">
                                                    Review
                                                </TabsTrigger>
                                                <TabsTrigger value="offer" className="flex items-center gap-2 cursor-pointer">
                                                    Offer
                                                </TabsTrigger>
                                                <TabsTrigger value="hired" className="flex items-center gap-2 cursor-pointer">
                                                    Hired
                                                </TabsTrigger>
                                            </TabsList>
                                            <div className="relative mt-6">
                                                <AnimatePresence mode="wait">
                                                    {activeTab === 'applied' && (
                                                        <motion.div
                                                            key="applied"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        >
                                                            <TabsContent value="applied" forceMount>
                                                                {isLoading ? <div className="flex items-center justify-center py-12"><Loading /></div> : <CandidatesTable data={candidatesApplied} />}
                                                            </TabsContent>
                                                        </motion.div>
                                                    )}
                                                    {activeTab === 'ai-screening' && (
                                                        <motion.div
                                                            key="ai-screening"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        >
                                                            <TabsContent value="ai-screening" forceMount>
                                                                {isLoading ? <div className="flex items-center justify-center py-12"><Loading /></div> : <CandidatesTable data={candidatesAI} />}
                                                            </TabsContent>
                                                        </motion.div>
                                                    )}
                                                    {activeTab === 'review' && (
                                                        <motion.div
                                                            key="review"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        >
                                                            <TabsContent value="review" forceMount>
                                                                {isLoading ? <div className="flex items-center justify-center py-12"><Loading /></div> : <CandidatesTable data={candidatesReview} />}
                                                            </TabsContent>
                                                        </motion.div>
                                                    )}
                                                    {activeTab === 'offer' && (
                                                        <motion.div
                                                            key="offer"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        >
                                                            <TabsContent value="offer" forceMount>
                                                                {isLoading ? <div className="flex items-center justify-center py-12"><Loading /></div> : <CandidatesTable data={candidatesOffer} />}
                                                            </TabsContent>
                                                        </motion.div>
                                                    )}
                                                    {activeTab === 'hired' && (
                                                        <motion.div
                                                            key="hired"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        >
                                                            <TabsContent value="hired" forceMount>
                                                                {isLoading ? <div className="flex items-center justify-center py-12"><Loading /></div> : <CandidatesTable data={candidatesHired} />}
                                                            </TabsContent>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </div>

            {/* Fixed AI Assistant Sidebar */}
            <AIAssistantSidebar />

            {/* Job Detail Modal */}
            {jobPostsData[0] && (
                <JobDetailModal
                    jobPost={jobPostsData[0]}
                    isOpen={isDetailModalOpen}
                    onOpenChange={setIsDetailModalOpen}
                />
            )}
        </>
    );
}
