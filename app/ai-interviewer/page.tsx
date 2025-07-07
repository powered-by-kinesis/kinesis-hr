'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { Loading } from '@/components/molecules/loading';
import { AiInterviewerTable } from '@/components/organisms/ai-interviewer-table';
import { dummy } from './dummy';

export default function AIInterviewerPage() {
  // State for storing fetched data
  const [candidatesData, setCandidatesData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Function to fetch all data
  const fetchData = React.useCallback(async () => {
    try {
      // setIsLoading(true);
      // const [candidates] = await Promise.all([
      //   applicantRepository.getAllApplicants(),
      // ]);
      setCandidatesData(dummy.candidates);
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
                      <h1 className="text-2xl font-semibold tracking-tight">AI Interviewer</h1>
                      <p className="text-muted-foreground">
                        Manage candidates and talent pipeline
                      </p>
                    </div>

                    <Tabs defaultValue="candidates">
                      <TabsContent value="candidates" className="mt-6">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loading />
                          </div>
                        ) : (
                          <AiInterviewerTable data={candidatesData} />
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
      <AIAssistantSidebar />
    </>
  );
}
