'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { JobPostResponseDTO } from '@/types/job-post';
import { CreateJobPostModal } from '@/components/organisms/create-job-post-modal';
import { DeleteAlert } from '@/components/organisms/delete-alert';
import { jobPostRepository } from '@/repositories';
import { JOB_STATUS_LABELS, JobStatus } from '@/constants/enums/job-status';
import { EMPLOYMENT_TYPE_LABELS, EmploymentType } from '@/constants/enums/employment-type';
import { formatDate } from '@/utils/format-date';

type JobPostData = JobPostResponseDTO;

// Function to get status badge variant
const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case JobStatus.PUBLISHED:
      return 'default';
    case JobStatus.DRAFT:
      return 'secondary';
    default:
      return 'secondary';
  }
};

// Function to get employment type badge color
const getEmploymentTypeVariant = (type: string): 'default' | 'secondary' | 'outline' => {
  switch (type) {
    case EmploymentType.FULL_TIME:
      return 'default';
    case EmploymentType.PART_TIME:
      return 'secondary';
    case EmploymentType.CONTRACT:
      return 'outline';
    case EmploymentType.INTERNSHIP:
      return 'outline';
    case EmploymentType.FREELANCE:
      return 'outline';
    default:
      return 'secondary';
  }
};

// Define columns for job posts table
const createColumns = (onJobPostDeleted?: () => void): ColumnDef<JobPostData>[] => {
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
      header: 'Job Title',
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <Link href={`/job-posts/${row.original.id}`} target="_blank" rel="noopener noreferrer">
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
      header: 'Location',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.location || 'Not specified'}</div>
      ),
    },
    {
      accessorKey: 'employmentType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={getEmploymentTypeVariant(row.original.employmentType)}>
          {EMPLOYMENT_TYPE_LABELS[row.original.employmentType as EmploymentType]}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {JOB_STATUS_LABELS[row.original.status as JobStatus]}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground">
            {formatDate(row.original.createdAt.toString())}
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'updatedAt',
    //   header: 'Updated',
    //   cell: ({ row }) => {
    //     const date =
    //       typeof row.original.updatedAt === 'string'
    //         ? new Date(row.original.updatedAt)
    //         : row.original.updatedAt;
    //     return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>;
    //   },
    // },
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
              <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
            </Link>
            <Link href={`/hiring/jobs/edit/${row.original.id}`}>
              <DropdownMenuItem className="cursor-pointer">Edit Job Post</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer">View Applications</DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status === JobStatus.PUBLISHED ? (
              <DropdownMenuItem className="cursor-pointer">Pause Job Post</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="cursor-pointer">Activate Job Post</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
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
  ];
};

interface JobPostsTableProps {
  data: JobPostData[];
  onJobPostCreated?: () => void; // Callback for when new job post is created
  onJobPostDeleted?: () => void; // Callback for when job post is deleted
}

export function JobPostsTable({ data, onJobPostCreated, onJobPostDeleted }: JobPostsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Create columns with delete callback
  const columns = React.useMemo(() => createColumns(onJobPostDeleted), [onJobPostDeleted]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Calculate stats
  const publishedJobs = data.filter((job) => job.status === JobStatus.PUBLISHED).length;
  const draftJobs = data.filter((job) => job.status === JobStatus.DRAFT).length;

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search job posts..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="text-xs">
              {publishedJobs} Published
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {draftJobs} Draft
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.length} Total
            </Badge>
          </div>
          <CreateJobPostModal onJobPostCreated={onJobPostCreated} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No job posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} job post(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>⟪
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>⟨
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>⟩
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>⟫
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
