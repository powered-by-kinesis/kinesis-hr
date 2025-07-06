'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { CandidateDetailsModal } from '@/components/organisms/candidate-details-modal';
import { CandidateRankingResponseDTO } from '@/types/candidate-ranking';
import Link from 'next/link';

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
import { ApplicantResponseDTO } from '@/types/applicant';

type CandidateData = ApplicantResponseDTO;

const createColumns = (router: any, onViewDetails: (candidateId: number) => void): ColumnDef<CandidateData>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    header: 'Full Name',
    cell: ({ row }) => <div className="font-medium">{row.original.fullName}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>,
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
    header: 'Applied Date',
    cell: ({ row }) => {
      const date =
        typeof row.original.appliedAt === 'string'
          ? new Date(row.original.appliedAt)
          : row.original.appliedAt;
      return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>;
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
          <DropdownMenuItem
            onClick={() => onViewDetails(row.original.id)}
            className="cursor-pointer"
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
          <DropdownMenuItem>Send Message</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Reject Candidate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface CandidatesTableProps {
  data: CandidateData[];
}

export function CandidatesTable({ data }: CandidatesTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedCandidate, setSelectedCandidate] = React.useState<CandidateRankingResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewDetails = (candidateId: number) => {
    // In a real app, you would fetch the candidate details by ID
    // For now, we'll create mock data similar to the previous implementation
    const mockCandidate: CandidateRankingResponseDTO = {
      candidate_id: candidateId.toString(),
      context_id: 1,
      score: 85,
      candidate_data: {
        name: 'C.S.',
        summary: 'Spearheaded strategic growth in new verticals at top firms, generating significant revenue and achieving sales targets; Boston College alumnus. Extensive account executive experience at top companies, strong soft skills, no founder roles',
        skills: [
          'B2B Sales',
          'Account Management',
          'HubSpot CRM',
          'SaaS Solutions',
          'Lead Generation',
          'Customer Relationship Management',
          'Sales Strategy',
          'Business Development',
        ],
        experience: [
          'Senior Account Executive at TechCorp (2020-2024)',
          'Account Executive at SalesForce (2018-2020)',
          'Sales Representative at StartupXYZ (2016-2018)',
        ],
      },
      ai_analysis: {
        overall_score: 88,
        justification: 'Strong candidate with extensive B2B sales experience and proven track record in SaaS environment. Excellent communication skills and strategic thinking abilities.',
        key_strengths: [
          'Proven sales track record',
          'Strong communication skills',
          'Strategic thinking',
          'SaaS experience',
          'Account management expertise',
        ],
        key_weaknesses: [
          'No startup experience',
          'Limited technical background',
        ],
        red_flags: [],
      },
    };

    setSelectedCandidate(mockCandidate);
    setIsModalOpen(true);
  };

  const handleRequestInterview = (candidateId: string) => {
    console.log('Request interview for candidate:', candidateId);
    // In real app, this would trigger interview scheduling
    alert(`Interview request sent for candidate ${candidateId}!`);
  };


  const columns = createColumns(router, handleViewDetails);

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

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search candidates..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{data.length} total candidates</Badge>
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
                  No candidates found.
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
          {table.getFilteredRowModel().rows.length} candidate(s) selected.
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

      {/* Candidate Details Modal */}
      <CandidateDetailsModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRequestInterview={handleRequestInterview}
      />
    </div>
  );
}
