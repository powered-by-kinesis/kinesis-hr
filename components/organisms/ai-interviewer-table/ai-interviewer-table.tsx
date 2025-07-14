'use client';

import * as React from 'react';
import { getInterviewTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';
import { StatusOptions } from '@/types/status-options';
import { InterviewInvitationResponseDTO } from '@/types/interview/InterviewInvitationResponseDTO';
import { InterviewInvitationDetailModal } from '@/components/organisms/interview-invitation-detail-modal/interview-invitation-detail-modal';

interface AiInterviewerTableProps {
  data: InterviewInvitationResponseDTO[];
}

export function AiInterviewerTable({ data }: AiInterviewerTableProps) {
  const [selectedInvitation, setSelectedInvitation] =
    React.useState<InterviewInvitationResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewDetails = (invitation: InterviewInvitationResponseDTO) => {
    setSelectedInvitation(invitation);
    setIsModalOpen(true);
  };

  const columns = getInterviewTableColumns(handleViewDetails);
  const statusOptions: StatusOptions[] = [
    {
      column: 'status',
      title: 'Status',
      options: [
        {
          label: 'Invited',
          value: 'INVITED',
        },
        {
          label: 'Completed',
          value: 'COMPLETED',
        },
      ],
    },
  ];

  console.log('data', data);

  return (
    <>
      <DataTable columns={columns} data={data} searchColumn="fullName" options={statusOptions} />
      <InterviewInvitationDetailModal
        invitation={selectedInvitation as InterviewInvitationResponseDTO}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
