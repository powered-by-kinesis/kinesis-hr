import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock, Building2 } from 'lucide-react';

import { jobPostRepository } from '@/repositories';
import { ApplicationForm } from '@/components/organisms/application-form';

// Function to get employment type badge variant
const getEmploymentTypeBadge = (type: string) => {
  switch (type.toLowerCase()) {
    case 'full-time':
      return <Badge variant="default">{type}</Badge>;
    case 'part-time':
      return <Badge variant="secondary">{type}</Badge>;
    case 'contract':
      return <Badge variant="outline">{type}</Badge>;
    case 'internship':
      return <Badge variant="outline">{type}</Badge>;
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
};

// Function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    case 'paused':
      return <Badge variant="outline">Paused</Badge>;
    case 'closed':
      return <Badge variant="destructive">Closed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

interface JobPostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobPostDetailPage({ params }: JobPostDetailPageProps) {
  const { id } = await params;

  try {
    const jobPost = await jobPostRepository.getJobPostById(parseInt(id));

    // If job post is not found, show 404
    if (!jobPost) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Job Details - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{jobPost.title}</CardTitle>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        {jobPost.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{jobPost.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getEmploymentTypeBadge(jobPost.employmentType)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{getStatusBadge(jobPost.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Posted {new Date(jobPost.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {jobPost.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Employment Type</h4>
                      <p className="text-muted-foreground">{jobPost.employmentType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Status</h4>
                      <p className="text-muted-foreground">{jobPost.status}</p>
                    </div>
                    {jobPost.location && (
                      <div>
                        <h4 className="font-medium mb-1">Location</h4>
                        <p className="text-muted-foreground">{jobPost.location}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium mb-1">Posted Date</h4>
                      <p className="text-muted-foreground">
                        {new Date(jobPost.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ApplicationForm jobPost={jobPost} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching job post:', error);
    notFound();
  }
}
