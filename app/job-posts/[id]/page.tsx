'use client'; // Required for animations and state

import { notFound } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { JobPost } from '@prisma/client';

import { jobPostRepository } from '@/repositories';
import { ApplicationForm } from '@/components/organisms/application-form';
import { EmploymentType } from '@/constants/enums/employment-type';
import { JobStatus } from '@/constants/enums/job-status';
import { formatDate } from '@/utils/format-date';
import { formatSalary } from '@/utils/format-salary/format-salary';
import { JobPostHeader } from '@/components/organisms/job-post-details/job-post-header';
import { JobPostContent } from '@/components/organisms/job-post-details/job-post-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

// Animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// Skeleton loader component for a better loading experience
const JobPostSkeleton = () => (
  <div className="container mx-auto px-4 py-12 max-w-7xl">
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-48 w-full rounded-xl bg-primary/10" />
        <Skeleton className="h-96 w-full rounded-xl bg-primary/10" />
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-80 w-full rounded-xl bg-primary/10" />
      </div>
    </div>
  </div>
);

export default function JobPostDetailPage() {
  const params = useParams();
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobPost = async () => {
      setIsLoading(true);
      try {
        const post = await jobPostRepository.getJobPostById(parseInt(params.id as string));
        if (!post) {
          notFound();
        } else {
          setJobPost(post);
        }
      } catch (error) {
        console.error('Error fetching job post:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPost();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 dark:bg-muted/50">
        <JobPostSkeleton />
      </div>
    );
  }

  if (!jobPost) {
    return null; // notFound() would have been called
  }

  // Derived data for rendering
  const formattedSalary = formatSalary(
    jobPost.salaryMin?.toString(),
    jobPost.salaryMax?.toString(),
    jobPost.currency,
    jobPost.salaryType,
  );

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/50">
      <motion.div
        className="container mx-auto px-4 py-12 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Side: Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <JobPostHeader
                title={jobPost.title}
                department={jobPost.department}
                location={jobPost.location}
                employmentType={jobPost.employmentType as EmploymentType}
                postedDate={formatDate(jobPost.createdAt.toString())}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <JobPostContent
                description={jobPost.description}
                formattedSalary={formattedSalary}
                statusLabel={jobPost.status as JobStatus}
              />
            </motion.div>
          </div>

          {/* Right Side: Application Form */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="sticky top-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Apply for this Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationForm jobPost={jobPost} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
