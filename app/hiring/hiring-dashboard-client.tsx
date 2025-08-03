'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobPostsTable } from '@/components/organisms/job-posts-table';
import { CandidatesTable } from '@/components/organisms/candidates-table';
import { JobPostResponseDTO } from '@/types/job-post';
import { ApplicantResponseDTO } from '@/types/applicant';

interface HiringDashboardClientProps {
  initialJobPosts: JobPostResponseDTO[];
  initialCandidates: ApplicantResponseDTO[];
}

export function HiringDashboardClient({
  initialJobPosts,
  initialCandidates,
}: HiringDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('job-openings');
  const { isMinimized: isAIAssistantMinimized } = useAIAssistant();

  // State to hold the data, initialized from props
  const [jobPostsData, setJobPostsData] = React.useState(initialJobPosts);
  const [candidatesData, setCandidatesData] = React.useState(initialCandidates);

  // This effect syncs the client state with the new server-provided props
  // after router.refresh() is called.
  React.useEffect(() => {
    setJobPostsData(initialJobPosts);
    setCandidatesData(initialCandidates);
  }, [initialJobPosts, initialCandidates]);

  const handleDataMutation = () => {
    router.refresh();
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 py-4 transition-all duration-300 ease-in-out md:gap-6 md:py-6',
        !isAIAssistantMinimized && 'lg:mr-96',
      )}
    >
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Hiring Dashboard</h1>
          <p className="text-muted-foreground">
            Manage job openings, candidates, and talent pipeline
          </p>
        </div>

        <Tabs defaultValue="job-openings" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="job-openings" className="flex items-center gap-2 cursor-pointer">
              Job Openings
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2 cursor-pointer">
              Candidates
            </TabsTrigger>
          </TabsList>
          <div className="relative mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'job-openings' && (
                <motion.div
                  key="job-openings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <TabsContent value="job-openings" forceMount>
                    <JobPostsTable
                      data={jobPostsData}
                      onJobPostCreated={handleDataMutation}
                      onJobPostDeleted={handleDataMutation}
                    />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === 'candidates' && (
                <motion.div
                  key="candidates"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <TabsContent value="candidates" forceMount>
                    <CandidatesTable data={candidatesData} onDelete={handleDataMutation} />
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
