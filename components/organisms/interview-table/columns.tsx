'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InterviewResponseDTO } from '@/types/interview';
import { DataTableColumnHeader } from '@/components/organisms/data-table/data-table-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { formatDate } from '@/utils/format-date';
import Link from 'next/link';
import { DeleteAlert } from '@/components/organisms/delete-alert/delete-alert';

export const getInterviewsTableColumns = (
  onEditInterview: (interview: InterviewResponseDTO) => void,
  onDeleteInterview: (interviewId: number) => void,
): ColumnDef<InterviewResponseDTO>[] => {
  return [
    {
      accessorKey: 'interviewName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Interview Name" />,
      cell: ({ row }) => (
        <Link href={`/ai-interviewer/${row.original.id}`}>
          <div className="font-medium cursor-pointer hover:underline">
            {row.getValue('interviewName')}
          </div>
        </Link>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'skills',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Skills" />,
      cell: ({ row }) => (
        <div>
          {(row.original.skills as { name: string; description: string }[])
            .map((s) => s.name)
            .join(', ')}
        </div>
      ),
    },
    {
      accessorKey: 'jobPost',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Job Post" />,
      cell: ({ row }) => (
        <Link href={`/hiring/jobs/detail/${row.original.jobPostId}`}>
          <div className="font-medium cursor-pointer hover:underline">
            {row.original.jobPost?.title || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      accessorKey: 'candidates',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Candidates" />,
      cell: ({ row }) => (
        <div>
          {row.original.invitations?.map((invitation) => invitation.applicant.fullName).join(', ')}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{formatDate(row.original.createdAt)}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEditInterview(row.original)}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DeleteAlert
              title="Delete Interview"
              description={`Are you sure you want to delete "${row.original.interviewName}"? This action cannot be undone.`}
              action="Delete"
              onConfirm={() => onDeleteInterview(row.original.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
