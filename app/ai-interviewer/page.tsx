'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { Loading } from '@/components/molecules/loading';
import { InterviewTable } from '@/components/organisms/interview-table/interview-table';
import { Button } from '@/components/ui/button';
import { CreateInterviewRequestDTO, InterviewResponseDTO } from '@/types/interview';
import { interviewRepository } from '@/repositories/interview-repository';
import { CreateInterviewModal } from '@/components/organisms/interview-modal/create-interview-modal';

export default function AIInterviewerPage() {
  // State for storing fetched data
  const [interviewsData, setInterviewsData] = React.useState<InterviewResponseDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Function to fetch all data
  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await interviewRepository.getAllInterviews();
      setInterviewsData(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateInterview = async (data: CreateInterviewRequestDTO): Promise<InterviewResponseDTO> => {
    try {
      const createdInterview = await interviewRepository.createInterview(data);
      // Re-fetch data to update the table with the new interview
      fetchData();
      setIsCreateModalOpen(false);
      return createdInterview; // Return the created interview
    } catch (error) {
      console.error('Error creating interview:', error);
      // Optionally, show an error message to the user
      throw error; // Re-throw the error so the modal can catch it
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
                {/* Main content with right margin to accommodate AI Assistant */}
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mr-96">
                  <div className="px-4 lg:px-6">
                    <div className="mb-6 flex justify-between">
                      <div>
                        <h1 className="text-2xl font-semibold tracking-tight">AI Interviewer</h1>
                        <p className="text-muted-foreground">
                          Manage candidates and talent pipeline
                        </p>
                      </div>
                      <Button onClick={() => setIsCreateModalOpen(true)}>Create New Interview</Button>
                    </div>

                    <Tabs defaultValue="candidates">
                      <TabsContent value="candidates" className="mt-6">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loading />
                          </div>
                        ) : (
                          <InterviewTable
                            data={interviewsData}
                            onInterviewUpdated={fetchData}
                            onInterviewDeleted={fetchData}
                          />
                        )}
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
      <AIAssistantSidebar isMinimized={false} onMinimize={function (): void {
        throw new Error('Function not implemented.');
      }} onMaximize={function (): void {
        throw new Error('Function not implemented.');
      }} />

      <CreateInterviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInterview}
      />
    </>
  );
}
