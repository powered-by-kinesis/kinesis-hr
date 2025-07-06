import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock, Building2 } from 'lucide-react';

import { jobPostRepository } from '@/repositories';
import { ApplicationForm } from '@/components/organisms/application-form';
import { EMPLOYMENT_TYPE_LABELS, EmploymentType } from '@/constants/enums/employment-type';
import { JOB_STATUS_LABELS, JobStatus } from '@/constants/enums/job-status';
import { formatDate } from '@/utils/format-date';

// Function to get employment type badge variant
const getEmploymentTypeBadge = (type: string) => {
  switch (type) {
    case EmploymentType.FULL_TIME:
      return <Badge variant="default">{EMPLOYMENT_TYPE_LABELS[EmploymentType.FULL_TIME]}</Badge>;
    case EmploymentType.PART_TIME:
      return <Badge variant="secondary">{EMPLOYMENT_TYPE_LABELS[EmploymentType.PART_TIME]}</Badge>;
    case EmploymentType.CONTRACT:
      return <Badge variant="outline">{EMPLOYMENT_TYPE_LABELS[EmploymentType.CONTRACT]}</Badge>;
    case EmploymentType.INTERNSHIP:
      return <Badge variant="outline">{EMPLOYMENT_TYPE_LABELS[EmploymentType.INTERNSHIP]}</Badge>;
    case EmploymentType.FREELANCE:
      return <Badge variant="outline">{EMPLOYMENT_TYPE_LABELS[EmploymentType.FREELANCE]}</Badge>;
    default:
      return <Badge variant="secondary">{EMPLOYMENT_TYPE_LABELS[EmploymentType.FULL_TIME]}</Badge>;
  }
};

// Function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case JobStatus.PUBLISHED:
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          {JOB_STATUS_LABELS[JobStatus.PUBLISHED]}
        </Badge>
      );
    case JobStatus.DRAFT:
      return <Badge variant="secondary">{JOB_STATUS_LABELS[JobStatus.DRAFT]}</Badge>;
    default:
      return <Badge variant="secondary">{JOB_STATUS_LABELS[JobStatus.DRAFT]}</Badge>;
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{getEmploymentTypeBadge(jobPost.employmentType)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{getStatusBadge(jobPost.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Posted {formatDate(jobPost.createdAt.toString())}</span>
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
                      <p className="text-muted-foreground">
                        {EMPLOYMENT_TYPE_LABELS[jobPost.employmentType as EmploymentType]}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Status</h4>
                      <p className="text-muted-foreground">
                        {JOB_STATUS_LABELS[jobPost.status as JobStatus]}
                      </p>
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
                        {formatDate(jobPost.createdAt.toString())}
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
