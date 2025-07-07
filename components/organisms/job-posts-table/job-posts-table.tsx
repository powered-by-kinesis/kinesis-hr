'use client';

import * as React from 'react';
import { JobPostResponseDTO } from '@/types/job-post';
import { getJobPostsTableColumns } from '@/components/organisms/job-posts-table/columns';
import { DataTable } from '@/components/organisms/data-table/data-table';
import { StatusOptions } from '@/types/status-options';
import { JOB_STATUS_OPTIONS } from '@/constants/enums/job-status';
import { EMPLOYMENT_TYPE_OPTIONS } from '@/constants/enums/employment-type';
import { CreateJobPostModal } from '@/components/organisms/create-job-post-modal';

interface JobPostsTableProps {
  data: JobPostResponseDTO[];
  onJobPostCreated?: () => void; // Callback for when new job post is created
  onJobPostDeleted?: () => void; // Callback for when job post is deleted
}

export function JobPostsTable({ data, onJobPostCreated, onJobPostDeleted }: JobPostsTableProps) {
  const columns = getJobPostsTableColumns(onJobPostDeleted);
  const statusOptions: StatusOptions[] = [
    {
      column: 'employmentType',
      title: 'Type',
      options: EMPLOYMENT_TYPE_OPTIONS as unknown as StatusOptions['options'],
    },
    {
      column: 'status',
      title: 'Status',
      options: JOB_STATUS_OPTIONS as unknown as StatusOptions['options'],
    },
  ];
  const [isCreateJobPostModalOpen, setIsCreateJobPostModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <CreateJobPostModal onJobPostCreated={onJobPostCreated} isOpen={isCreateJobPostModalOpen} onOpenChange={setIsCreateJobPostModalOpen} />
      <DataTable columns={columns} data={data} options={statusOptions} />
    </div>
  );
}
