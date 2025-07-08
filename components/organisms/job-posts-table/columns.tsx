"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";

import { JobPostResponseDTO } from "@/types/job-post";
import { EmploymentType } from "@/constants/enums/employment-type";
import { JobStatus } from "@/constants/enums/job-status";
import { formatDate } from "@/utils/format-date";
import { DeleteAlert } from "../delete-alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { jobPostRepository } from '@/repositories';
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/organisms/data-table/data-table-column-header";
import { JobBadge, EmploymentTypeBadge } from "@/components/molecules/badge";

export const GetJobPostsTableColumns = (onJobPostDeleted?: () => void, onEditJobPost?: (data: JobPostResponseDTO) => void): ColumnDef<JobPostResponseDTO>[] => {
  // Function to handle job post deletion (called after confirmation)
  const handleDeleteJobPost = async (id: number) => {
    try {
      // Delete job post using repository
      await jobPostRepository.deleteJobPost(id);

      // Show success toast
      toast.success('Job post deleted successfully!');

      // Trigger callback to refresh data
      onJobPostDeleted?.();
    } catch (error) {
      console.error('Error deleting job post:', error);
      toast.error('Failed to delete job post. Please try again.');
    }
  };

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
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Job Title" />,
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <Link href={`/hiring/jobs/detail/${row.original.id}`}>
            <div className="font-medium hover:text-blue-500 hover:underline cursor-pointer">
              {row.original.title}
            </div>
          </Link>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
            {row.original.description}
          </div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'location',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.location || 'Not specified'}</div>
      ),
    },
    {
      accessorKey: 'employmentType',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <EmploymentTypeBadge employmentType={row.original.employmentType as EmploymentType} />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <JobBadge status={row.original.status as JobStatus} />
      ),
    },
    {
      accessorKey: 'applications',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Applicants" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.applications?.length || 0}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground">
            {formatDate(row.original.createdAt.toString())}
          </div>
        );
      },
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
            <Link href={`/job-posts/${row.original.id}`} target="_blank" rel="noopener noreferrer">
              <DropdownMenuItem className="cursor-pointer">View Job Post</DropdownMenuItem>
            </Link>
            <Link href={`/hiring/jobs/detail/${row.original.id}`}>
              <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onEditJobPost?.(row.original)}>
              Edit Job Post
            </DropdownMenuItem>
            <DeleteAlert
              title="Delete Job Post"
              description={`Are you sure you want to delete "${row.original.title}"? This action cannot be undone.`}
              action="Delete Job Post"
              onConfirm={() => handleDeleteJobPost(row.original.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
};
