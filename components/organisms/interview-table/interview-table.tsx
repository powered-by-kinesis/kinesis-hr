'use client';

import * as React from 'react';
import { InterviewResponseDTO } from '@/types/interview';
import { getInterviewsTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';
import { StatusOptions } from '@/types/status-options';
import { UpdateInterviewRequestDTO } from '@/types/interview/UpdateInterviewRequestDTO'; // Assuming this DTO exists
import { interviewRepository } from '@/repositories/interview-repository'; // Assuming this repository exists
import { EditInterviewModal } from '../interview-modal/edit-interview-modal';
import { toast } from 'sonner';

interface InterviewTableProps {
  data: InterviewResponseDTO[];
  onInterviewUpdated: () => void; // Callback to refresh data after update/delete
  onInterviewDeleted: () => void;
}

export function InterviewTable({
  data,
  onInterviewUpdated,
  onInterviewDeleted,
}: InterviewTableProps) {
  const [selectedInterview, setSelectedInterview] = React.useState<InterviewResponseDTO | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleEditInterview = (interview: InterviewResponseDTO) => {
    setSelectedInterview(interview);
    setIsEditModalOpen(true);
  };

  const handleDeleteInterview = async (interviewId: number) => {
    try {
      await interviewRepository.deleteInterview(interviewId);
      onInterviewDeleted();
      toast.success('Interview deleted successfully.');
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview.');
    }
  };

  const handleUpdateInterview = async (updatedData: UpdateInterviewRequestDTO) => {
    if (selectedInterview) {
      try {
        await interviewRepository.updateInterview(selectedInterview.id, updatedData);
        setIsEditModalOpen(false);
        setSelectedInterview(null);
        onInterviewUpdated();
        toast.success('Interview updated successfully.');
      } catch (error) {
        console.error('Error updating interview:', error);
        toast.error('Failed to update interview.');
      }
    }
  };

  const columns = getInterviewsTableColumns(handleEditInterview, handleDeleteInterview);
  const statusOptions: StatusOptions[] = []; // Removed overallLevel as it's not a direct property of Interview

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchColumn="interviewName"
        options={statusOptions}
      />
      {isEditModalOpen && selectedInterview && (
        <EditInterviewModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedInterview(null);
          }}
          onSubmit={handleUpdateInterview}
          initialData={selectedInterview}
        />
      )}
    </>
  );
}
