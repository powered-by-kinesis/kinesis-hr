'use client';

import * as React from 'react';
import { ApplicantResponseDTO } from '@/types/applicant';
import { getCandidatesTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';

type CandidateData = ApplicantResponseDTO;
interface CandidatesTableProps {
  data: CandidateData[];
}

export function CandidatesTable({ data }: CandidatesTableProps) {
  const columns = getCandidatesTableColumns();

  return (
    <>
      <DataTable columns={columns} data={data} searchColumn="fullName" />
    </>
  );
}
