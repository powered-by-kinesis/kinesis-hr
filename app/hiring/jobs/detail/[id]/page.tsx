import { jobPostRepository } from '@/repositories';
import { JobDetailClient } from './job-detail-client';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  // Fetch data on the server
  const jobPostData = await jobPostRepository.getJobPostById(Number(params.id));

  return <JobDetailClient initialData={jobPostData} />;
}
