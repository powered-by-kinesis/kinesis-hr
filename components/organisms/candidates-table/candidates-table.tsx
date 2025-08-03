'use client';

import * as React from 'react';
import { ApplicantResponseDTO } from '@/types/applicant';
import { getCandidatesTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';

type CandidateData = ApplicantResponseDTO;
interface CandidatesTableProps {
  data: CandidateData[];
  onDelete?: () => void;
}

export function CandidatesTable({ data, onDelete }: CandidatesTableProps) {
  const columns = getCandidatesTableColumns(onDelete);

  return (
    <>
      <DataTable columns={columns} data={data} searchColumn="fullName" />
    </>
  );
}
