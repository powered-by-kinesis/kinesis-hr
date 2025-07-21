'use client';

import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { jobPostRepository, applicantRepository, applicationRepository } from '@/repositories';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ApplicationResponseDTO } from '@/types/application';
import { JobPostResponseDTO } from '@/types/job-post/JobPostResponseDTO';
import { ApplicantResponseDTO } from '@/types/applicant/ApplicantResponseDTO';

export default function HomePage() {
  // State for analytics
  const [jobPosts, setJobPosts] = useState<JobPostResponseDTO[]>([]);
  const [applicants, setApplicants] = useState<ApplicantResponseDTO[]>([]);
  const [applications, setApplications] = useState<ApplicationResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [jobPostsData, applicantsData, applicationsData] = await Promise.all([
          jobPostRepository.getAllJobPosts(),
          applicantRepository.getAllApplicants(),
          applicationRepository.getAllApplications(),
        ]);
        setJobPosts(jobPostsData);
        setApplicants(applicantsData);
        setApplications(applicationsData);
      } catch (error) {
        // Handle error (could show toast or fallback UI)
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate analytics
  const totalJobPosts = jobPosts.length;
  const totalApplicants = applicants.length;
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter((a: ApplicationResponseDTO) => a.currentStage === 'HIRED').length;
  const rejectedApplications = applications.filter((a: ApplicationResponseDTO) => a.currentStage === 'REJECTED').length;

  return (
    <div className="relative min-h-screen bg-background">
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
                <h1 className="text-2xl font-bold">HR Analytics Dashboard</h1>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Get a quick overview of your hiring process. All stats are updated in real-time.
                  </p>
                </div>
                {/* Responsive Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6 w-full">
                  {/* Total Job Posts */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardDescription>Total Job Posts</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? '...' : totalJobPosts}</CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp />
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="flex gap-2 font-medium">Active job postings</div>
                      <div className="text-muted-foreground">All open and closed jobs</div>
                    </CardFooter>
                  </Card>
                  {/* Total Applicants */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardDescription>Total Candidates</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? '...' : totalApplicants}</CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp />
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="flex gap-2 font-medium">Registered candidates</div>
                      <div className="text-muted-foreground">All applicants in the system</div>
                    </CardFooter>
                  </Card>
                  {/* Total Applications */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardDescription>Total Applications</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? '...' : totalApplications}</CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp />
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="flex gap-2 font-medium">All submitted applications</div>
                      <div className="text-muted-foreground">Across all job posts</div>
                    </CardFooter>
                  </Card>
                  {/* Accepted Applications */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardDescription>Accepted (Hired)</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? '...' : acceptedApplications}</CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp />
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="flex gap-2 font-medium">Candidates hired</div>
                      <div className="text-muted-foreground">Congratulations!</div>
                    </CardFooter>
                  </Card>
                  {/* Rejected Applications */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardDescription>Rejected</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? '...' : rejectedApplications}</CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingDown />
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="flex gap-2 font-medium">Applications rejected</div>
                      <div className="text-muted-foreground">Keep improving your process</div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
