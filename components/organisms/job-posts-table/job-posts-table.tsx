'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobPostResponseDTO } from '@/types/job-post';
import { GetJobPostsTableColumns } from '@/components/organisms/job-posts-table/columns';
import { DataTable } from '@/components/organisms/data-table/data-table';
import { StatusOptions } from '@/types/status-options';
import { JOB_STATUS_OPTIONS } from '@/constants/enums/job-status';
import { EMPLOYMENT_TYPE_OPTIONS } from '@/constants/enums/employment-type';
import { JobPostModal } from '@/components/organisms/job-post-modal';

interface JobPostsTableProps {
  data: JobPostResponseDTO[];
  onJobPostCreated?: () => void; // Callback for when new job post is created
  onJobPostDeleted?: () => void; // Callback for when job post is deleted
}

export function JobPostsTable({ data, onJobPostCreated, onJobPostDeleted }: JobPostsTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedJobPost, setSelectedJobPost] = React.useState<JobPostResponseDTO | null>(null);

  const handleEditJobPost = (data: JobPostResponseDTO) => {
    setSelectedJobPost(data);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateJobPostModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedJobPost(null);
  };

  const columns = GetJobPostsTableColumns(onJobPostDeleted, handleEditJobPost);

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
      <div className="flex justify-end">
        <Button
          size="sm"
          className="w-fit cursor-pointer"
          onClick={() => setIsCreateJobPostModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Job Post
        </Button>
      </div>

      <JobPostModal
        onJobPostCreated={onJobPostCreated}
        isOpen={isCreateJobPostModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
          else if (!isEditModalOpen) setIsCreateJobPostModalOpen(true);
        }}
        jobPost={selectedJobPost || undefined}
        onClose={handleCloseModal}
      />
      <DataTable columns={columns} data={data} options={statusOptions} searchColumn="title" />
    </div>
  );
}
