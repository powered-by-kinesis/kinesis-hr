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


export function ApplicationTable({ data }: { data: ApplicantResponseDTO }) {

  const transformedData = React.useMemo<ApplicationTableData[]>(() => {
    if (!data.applications) return [];
    return data.applications.map((application) => ({
      id: application.id,
      resumeUrl: data.resumeUrl,
      currentStage: application.currentStage,
      expectedSalary: application.expectedSalary,
      appliedAt: application.appliedAt,
      notes: application.notes,
      jobTitle: application.jobPost?.title ?? 'Unknown Job',
      jobPostId: application.jobPostId,
    }))
  }, [data]);


  const columns = getApplicationTableColumns();

  return (
    <>
      <DataTable columns={columns} data={transformedData} searchColumn="jobTitle" />
    </>
  );
}
