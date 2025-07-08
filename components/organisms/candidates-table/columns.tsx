"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { ApplicantResponseDTO } from '@/types/applicant';
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { formatDate } from "@/utils/format-date";
import { toast } from "sonner";

type CandidateData = ApplicantResponseDTO;


export const getCandidatesTableColumns = (onViewDetails: (candidateId: number) => void): ColumnDef<CandidateData>[] => {

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="cursor-pointer"
          checked={
            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="cursor-pointer"
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
      cell: ({ row }) => (
        <Link href={`/candidates/${row.original.id}`} className="font-medium hover:underline cursor-pointer hover:text-blue-500">
          {row.original.fullName}
        </Link>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground hover:underline cursor-pointer" onClick={() => {
          window.open(`mailto:${row.original.email}`, '_blank');
          toast.success('Email opened in new tab');
        }}>{row.original.email || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.phone || 'N/A'}</div>,
    },
    {
      accessorKey: 'resumeUrl',
      header: 'Resume',
      cell: ({ row }) => (
        <div>
          {row.original.resumeUrl ? (
            <Link href={row.original.resumeUrl} target="_blank" rel="noopener noreferrer">
              <div className="font-medium hover:text-blue-500 hover:underline cursor-pointer">
                View Resume
              </div>
            </Link>
          ) : (
            <span className="text-muted-foreground text-sm">No resume</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'appliedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Applied Date" />,
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{formatDate(row.original.appliedAt.toString())}</div>;
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
              onClick={() => onViewDetails(row.original.id)}
              className="cursor-pointer"
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Schedule Interview</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">Reject Candidate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
};
