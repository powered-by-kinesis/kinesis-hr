import { jobPostRepository } from '@/repositories';
import { JobDetailClient } from './job-detail-client';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch data on the server
  const { id } = await params;
  const jobPostData = await jobPostRepository.getJobPostById(Number(id));

  return <JobDetailClient initialData={jobPostData} />;
}
