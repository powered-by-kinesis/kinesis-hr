'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { CandidatesTable } from '@/components/organisms/candidates-table';
import { JobPostsTable } from '@/components/organisms/job-posts-table';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { Loading } from '@/components/molecules/loading';

// Import repositories and types
import { jobPostRepository, applicantRepository } from '@/repositories';
import { JobPostResponseDTO } from '@/types/job-post';
import { ApplicantResponseDTO } from '@/types/applicant';

export default function HiringPage() {
  // State for storing fetched data
  const [jobPostsData, setJobPostsData] = React.useState<JobPostResponseDTO[]>([]);
  const [candidatesData, setCandidatesData] = React.useState<ApplicantResponseDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Function to fetch all data
  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [jobPosts, candidates] = await Promise.all([
        jobPostRepository.getAllJobPosts(),
        applicantRepository.getAllApplicants(),
      ]);
      setJobPostsData(jobPosts);
      setCandidatesData(candidates);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Callback for when new job post is created
  const handleJobPostCreated = React.useCallback(() => {
    fetchData(); // Re-fetch all job posts to get the latest data
  }, [fetchData]);

  // Callback for when job post is deleted
  const handleJobPostDeleted = React.useCallback(() => {
    fetchData(); // Re-fetch all job posts to get the latest data
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
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mr-96">
                  <div className="px-4 lg:px-6">
                    <div className="mb-6">
                      <h1 className="text-2xl font-semibold tracking-tight">Hiring Dashboard</h1>
                      <p className="text-muted-foreground">
                        Manage job openings, candidates, and talent pipeline
                      </p>
                    </div>

                    <Tabs defaultValue="job-openings">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="job-openings" className="flex items-center gap-2">
                          Job Openings
                        </TabsTrigger>
                        <TabsTrigger value="candidates" className="flex items-center gap-2">
                          Candidates
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="job-openings" className="mt-6">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loading />
                          </div>
                        ) : (
                          <JobPostsTable
                            data={jobPostsData}
                            onJobPostCreated={handleJobPostCreated}
                            onJobPostDeleted={handleJobPostDeleted}
                          />
                        )}
                      </TabsContent>

                      <TabsContent value="candidates" className="mt-6">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loading />
                          </div>
                        ) : (
                          <CandidatesTable data={candidatesData} />
                        )}
                      </TabsContent>

                      <TabsContent value="talents" className="mt-6">
                        <div className="space-y-4">
                          <div className="text-center py-12 border border-dashed rounded-lg">
                            <h3 className="text-lg font-medium">Talent Pipeline</h3>
                            <p className="text-muted-foreground mt-2">
                              Talent pool and pipeline management interface will be implemented here
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              5 talents in pipeline
                            </p>
                          </div>
                        </div>
                      </TabsContent>
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
    </>
  );
}
