"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { formatDate } from "@/utils/format-date";
import { ApplicationTableData } from "./application-table";

export const getApplicationTableColumns = (): ColumnDef<ApplicationTableData>[] => {

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
        <Link href={`/hiring/jobs/detail/${row.original.jobPostId}`} className="font-medium hover:underline cursor-pointer hover:text-blue-500">
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
  ]
};
