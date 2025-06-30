import { AppSidebar } from '@/components/organisms/app-sidebar';
import { CandidatesTable } from '@/components/organisms/candidates-table';
import { JobPostsTable } from '@/components/organisms/job-posts-table';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import repositories
import { jobPostRepository, applicantRepository } from '@/repositories';

export default async function HiringPage() {
  // Fetch data from database using repositories
  const [jobPostsData, candidatesData] = await Promise.all([
    jobPostRepository.getAllJobPosts(),
    applicantRepository.getAllApplicants(),
  ]);
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
                      <Badge variant="secondary" className="text-xs">
                        {jobPostsData.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="candidates" className="flex items-center gap-2">
                      Candidates
                      <Badge variant="secondary" className="text-xs">
                        {candidatesData.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="job-openings" className="mt-6">
                    <JobPostsTable data={jobPostsData} />
                  </TabsContent>

                  <TabsContent value="candidates" className="mt-6">
                    <CandidatesTable data={candidatesData} />
                  </TabsContent>

                  <TabsContent value="talents" className="mt-6">
                    <div className="space-y-4">
                      <div className="text-center py-12 border border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">Talent Pipeline</h3>
                        <p className="text-muted-foreground mt-2">
                          Talent pool and pipeline management interface will be implemented here
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">5 talents in pipeline</p>
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
  );
}
