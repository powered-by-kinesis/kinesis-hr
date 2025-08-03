'use client';

import * as React from 'react';
import { ApplicantResponseDTO } from '@/types/applicant';
import { GetCandidatesTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';

type CandidateData = ApplicantResponseDTO;
interface CandidatesTableProps {
  data: CandidateData[];
  onDelete: () => void;
  isLoading?: boolean;
}

export function CandidatesTable({ data, onDelete, isLoading }: CandidatesTableProps) {
  const columns = GetCandidatesTableColumns(onDelete);

  return (
    <>
      <DataTable columns={columns} data={data} searchColumn="fullName" isLoading={isLoading} />
    </>
  );
}
