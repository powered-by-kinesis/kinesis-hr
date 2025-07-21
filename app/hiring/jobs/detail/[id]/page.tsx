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
import { useParams } from 'next/navigation';
import { JobDetailModal } from './job-detail-modal';
import { jobPostRepository } from '@/repositories';
import { JobPostResponseDTO } from '@/types/job-post';
import { Stage } from '@/constants/enums/stage';
import { Candidate } from '@/types/candidate/Candidate';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function JobDetailPage() {
  const params = useParams();
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  // State for storing fetched data
  const [jobPostsData, setJobPostsData] = React.useState<JobPostResponseDTO[]>([]);
  const [candidatesApplied, setCandidatesApplied] = React.useState<Candidate[]>([]);
  const [candidatesHired, setCandidatesHired] = React.useState<Candidate[]>([]);
  const [candidatesAI, setCandidatesAI] = React.useState<Candidate[]>([]);
  const [candidatesReview, setCandidatesReview] = React.useState<Candidate[]>([]);
  const [candidatesOffer, setCandidatesOffer] = React.useState<Candidate[]>([]);
  const [candidateRejected, setCandidateRejected] = React.useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
  const [activeTab, setActiveTab] = React.useState('applied');

  const transformJobPostToCandidates = (jobPost: JobPostResponseDTO, filter?: Stage) => {
    return (
      jobPost.applications
        ?.filter((application) => application.currentStage === filter)
        .map((application) => ({
          ...application.applicant,
          appliedAt: application.appliedAt,
          phone: application.applicant.phone || null,
          resumeUrl: application?.documents[0]?.document.filePath || null,
          stage: application.currentStage,
        })) || []
    );
  };

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
      setCandidateRejected(transformJobPostToCandidates(jobPost, Stage.REJECTED));
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
                <div
                  className={cn(
                    'flex flex-col gap-4 py-4 md:gap-6 md:py-6',
                    !isAIAssistantMinimized && 'mr-96',
                  )}
                >
                  <div className="px-4 lg:px-6">
                    <div className="mb-6 flex gap-4 justify-between items-center">
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="/hiring">Hiring</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            {jobPostsData[0]?.title || 'Job Post Detail'}
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 cursor-pointer"
                        onClick={() => setIsDetailModalOpen(true)}
                      >
                        View Description
                      </Button>
                    </div>

                    {/* Responsive stage selection: dropdown on mobile, tabs on desktop */}
                    <div className="block md:hidden mb-4">
                      <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="ai-screening">AI Screening</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="block md:hidden relative mt-6">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loading />
                        </div>
                      ) : activeTab === 'applied' ? (
                        <CandidatesTable data={candidatesApplied} />
                      ) : activeTab === 'ai-screening' ? (
                        <CandidatesTable data={candidatesAI} />
                      ) : activeTab === 'review' ? (
                        <CandidatesTable data={candidatesReview} />
                      ) : activeTab === 'offer' ? (
                        <CandidatesTable data={candidatesOffer} />
                      ) : activeTab === 'hired' ? (
                        <CandidatesTable data={candidatesHired} />
                      ) : activeTab === 'rejected' ? (
                        <CandidatesTable data={candidateRejected} />
                      ) : null}
                    </div>
                    <div className="hidden md:block">
                      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-6">
                          <TabsTrigger
                            value="applied"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Applied
                          </TabsTrigger>
                          <TabsTrigger
                            value="ai-screening"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            AI Screening
                          </TabsTrigger>
                          <TabsTrigger
                            value="review"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Review
                          </TabsTrigger>
                          <TabsTrigger
                            value="offer"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Offer
                          </TabsTrigger>
                          <TabsTrigger
                            value="hired"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Hired
                          </TabsTrigger>
                          <TabsTrigger
                            value="rejected"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Rejected
                          </TabsTrigger>
                        </TabsList>
                        <div className="relative mt-6">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                              <TabsContent value="applied">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <Loading />
                                  </div>
                                ) : (
                                  <CandidatesTable data={candidatesApplied} />
                                )}
                              </TabsContent>
                              <TabsContent value="ai-screening">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <Loading />
                                  </div>
                                ) : (
                                  <CandidatesTable data={candidatesAI} />
                                )}
                              </TabsContent>
                              <TabsContent value="review">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <Loading />
                                  </div>
                                ) : (
                                  <CandidatesTable data={candidatesReview} />
                                )}
                              </TabsContent>
                              <TabsContent value="offer">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <Loading />
                                  </div>
                                ) : (
                                  <CandidatesTable data={candidatesOffer} />
                                )}
                              </TabsContent>
                              <TabsContent value="hired">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <Loading />
                                  </div>
                                ) : (
                                  <CandidatesTable data={candidatesHired} />
                                )}
                              </TabsContent>
                              <TabsContent value="rejected">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-12">
                                    <Loading />
                                  </div>
                                ) : (
                                  <CandidatesTable data={candidateRejected} />
                                )}
                              </TabsContent>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </Tabs>
                    </div>
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
