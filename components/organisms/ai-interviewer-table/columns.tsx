'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DataTableColumnHeader } from '../data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/format-date';
import { InterviewInvitationResponseDTO } from '@/types/interview/InterviewInvitationResponseDTO';

interface InterviewSkill {
  name: string;
  description: string;
}

export const getInterviewTableColumns = (
  onViewDetails: (invitation: InterviewInvitationResponseDTO) => void,
): ColumnDef<InterviewInvitationResponseDTO>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
      cell: ({ row }) => <div className="font-medium">{row.original.applicant.fullName}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'dateTaken',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date Taken" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{formatDate(row.original.dateTaken ?? '')}</div>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Expires At" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{formatDate(row.original.expiresAt ?? '')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeColor = 'bg-gray-900 text-white';
        if (status === 'COMPLETED') {
          badgeColor = 'bg-green-500 text-white';
        } else if (status === 'INVITED') {
          badgeColor = 'bg-yellow-500 text-white';
        }
        return (
          <Badge variant="outline" className={badgeColor}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'skills',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Skills" />,
      cell: ({ row }) => {
        const skills = row.original.interview.skills;
        return (
          <div className="text-muted-foreground">
            {Array.isArray(skills)
              ? (skills as unknown as InterviewSkill[]).map((skill) => skill.name).join(', ')
              : '-'}
          </div>
        );
      },
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
              onClick={() => onViewDetails(row.original)}
              className="cursor-pointer"
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
