"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { formatDate } from "@/utils/format-date";
import { ApplicationTableData } from "./application-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DeleteAlert } from "../delete-alert";
import { applicationRepository } from "@/repositories/application-repository";
import { toast } from "sonner";

export const getApplicationTableColumns = (onDeleteApplication?: (id: number) => void, onEditApplication?: (data: ApplicationTableData) => void): ColumnDef<ApplicationTableData>[] => {
  const handleDeleteApplication = async (id: number) => {
    try {
      await applicationRepository.deleteApplication(id);
      toast.success('Application deleted successfully!');
      onDeleteApplication?.(id);
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application. Please try again.');
    }
  };

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
      accessorKey: 'jobTitle',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Job Title" />,
      cell: ({ row }) => (
        <Link href={`/hiring/jobs/detail/${row.original.jobPostId}`} className="font-medium hover:underline cursor-pointer hover:text-primary">
          {row.original.jobTitle}
        </Link>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'currentStage',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Current Stage" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.currentStage || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'resumeUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Resume" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          <a href={row.original.resumeUrl || ''} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        </div>
      ),
    },
    {
      accessorKey: 'expectedSalary',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Expected Salary" />,
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.expectedSalary || 'N/A'}</div>,
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.notes || 'N/A'}</div>,
    },
    {
      accessorKey: 'appliedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Applied Date" />,
      cell: ({ row }) => (
        <div>
          {formatDate(row.original.appliedAt.toString())}
        </div>
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => onEditApplication?.(row.original)}>
              Edit Application
            </DropdownMenuItem>
            <DeleteAlert
              title="Delete Application"
              description={`Are you sure you want to delete "${row.original.jobTitle}"? This action cannot be undone.`}
              action="Delete Application"
              onConfirm={() => handleDeleteApplication(row.original.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
};
