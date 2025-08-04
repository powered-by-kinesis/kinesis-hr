'use client';

import * as React from 'react';
import { ApplicantResponseDTO } from '@/types/applicant';
import { getApplicantTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';

type ApplicantData = ApplicantResponseDTO;
interface ApplicantTableProps {
  data: ApplicantData[];
  onDelete: () => void;
  isLoading?: boolean;
}

export function ApplicantTable({ data, onDelete, isLoading }: ApplicantTableProps) {
  const columns = getApplicantTableColumns(onDelete);

  return (
    <>
      <DataTable columns={columns} data={data} searchColumn="fullName" isLoading={isLoading} />
    </>
  );
}
