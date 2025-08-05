'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { CandidatesTable } from '@/components/organisms/candidates-table';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { JobDetailModal } from './job-detail-modal';
import { JobPostResponseDTO } from '@/types/job-post';
import { Stage } from '@/constants/enums/stage';
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
import { handleMutation as handleHiringMutation } from '@/utils/mutation/mutation';

interface JobDetailClientProps {
  initialData: JobPostResponseDTO;
}

export function JobDetailClient({ initialData }: JobDetailClientProps) {
  const params = useParams();
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [jobPostsData, setJobPostsData] = React.useState(initialData);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
  const [activeTab, setActiveTab] = React.useState('applied');

  React.useEffect(() => {
    setJobPostsData(initialData);
  }, [initialData]);

  const transformJobPostToCandidates = (jobPost: JobPostResponseDTO, filter?: Stage) => {
    return (
      jobPost?.applications
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

  const handleMutation = async (action: string) => {
    try {
      setIsTableLoading(true);
      const result = await handleHiringMutation(action, `/hiring/jobs/detail/${params.id}`);
      if (!result.success) {
        console.error(`Failed to handle ${action}`);
      }
    } finally {
      setIsTableLoading(false);
    }
  };

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
                            {jobPostsData?.title || 'Job Post Detail'}
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
                      {activeTab === 'applied' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.APPLIED)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'ai-screening' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.AI_SCREENING)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'review' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.REVIEW)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'offer' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.OFFER)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'hired' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.HIRED)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'rejected' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.REJECTED)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
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
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.APPLIED)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="ai-screening">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(
                                    jobPostsData!,
                                    Stage.AI_SCREENING,
                                  )}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="review">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.REVIEW)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="offer">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.OFFER)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="hired">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.HIRED)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="rejected">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.REJECTED)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
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

      <AIAssistantSidebar />

      {jobPostsData && (
        <JobDetailModal
          jobPost={jobPostsData}
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      )}
    </>
  );
}
