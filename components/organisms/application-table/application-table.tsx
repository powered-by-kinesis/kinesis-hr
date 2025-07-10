'use client';

import * as React from 'react';
import { ApplicantResponseDTO } from '@/types/applicant';
import { getApplicationTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';
import { Stage } from '@prisma/client';

export interface ApplicationTableData {
  id: number;
  resumeUrl: string | null;
  currentStage: Stage;
  expectedSalary: string;
  appliedAt: Date;
  notes?: string | null;
  jobTitle: string;
  jobPostId: number;
}

interface ApplicationTableProps {
  data: ApplicantResponseDTO;
  onDeleteApplication?: (id: number) => void;
  onEditApplication?: (data: ApplicationTableData) => void;
}


export function ApplicationTable({ data, onDeleteApplication, onEditApplication }: ApplicationTableProps) {

  const transformedData = React.useMemo<ApplicationTableData[]>(() => {
    if (!data.applications) return [];
    return data.applications.map((application) => ({
      id: application.id,
      resumeUrl: application?.documents[0]?.document?.filePath,
      currentStage: application.currentStage,
      expectedSalary: application.expectedSalary,
      appliedAt: application.appliedAt,
      notes: application.notes,
      jobTitle: application.jobPost?.title ?? 'Unknown Job',
      jobPostId: application.jobPostId,
    }))
  }, [data]);


  const columns = getApplicationTableColumns(onDeleteApplication, onEditApplication);

  return (
    <>
      <DataTable columns={columns} data={transformedData} searchColumn="jobTitle" />
    </>
  );
}
