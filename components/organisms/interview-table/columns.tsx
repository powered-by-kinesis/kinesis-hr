'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InterviewResponseDTO } from '@/types/interview';
import { DataTableColumnHeader } from '@/components/organisms/data-table/data-table-column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { formatDate } from '@/utils/format-date';
import Link from 'next/link';

export const getInterviewsTableColumns = (onEditInterview: (interview: InterviewResponseDTO) => void, onDeleteInterview: (interviewId: number) => void): ColumnDef<InterviewResponseDTO>[] => {
    return [
        {
            accessorKey: 'interviewName',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Interview Name" />
            ),
            cell: ({ row }) => <Link href={`/ai-interviewer/${row.original.id}`}><div className="font-medium cursor-pointer hover:underline">{row.getValue('interviewName')}</div></Link>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'skills',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Skills" />
            ),
            cell: ({ row }) => <div>{(row.original.skills as { name: string; description: string }[]).map(s => s.name).join(', ')}</div>,
        },
        {
            accessorKey: 'jobPost',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Job Post" />
            ),
            cell: ({ row }) => <div>{row.original.jobPost?.title || 'N/A'}</div>,
        },
        {
            accessorKey: 'candidates',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Candidates" />
            ),
            cell: ({ row }) => <div>{row.original.invitations?.map(invitation => invitation.applicant.fullName).join(', ')}</div>,
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created At" />
            ),
            cell: ({ row }) => <div className="text-muted-foreground">{formatDate(row.original.createdAt)}</div>,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDeleteInterview(row.original.id)}
                            className="text-destructive cursor-pointer"
                        >
                            Delete Interview
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
};
