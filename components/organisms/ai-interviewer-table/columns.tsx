"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { SkillLevel } from "@/constants/enums/skill-level";
import { formatDate } from "@/utils/format-date";
import { InterviewType } from "@/constants/enums/interview-type";

const getSkillLevelBadge = (skillLevel: SkillLevel) => {
  switch (skillLevel) {
    case SkillLevel.NOVICE:
      return <Badge variant="outline" className="bg-gray-900 text-white">Novice</Badge>;
    case SkillLevel.INTERMEDIATE:
      return <Badge variant="outline" className="bg-blue-900 text-white">Intermediate</Badge>
    case SkillLevel.PROFICIENT:
      return <Badge variant="outline" className="bg-green-900 text-white">Proficient</Badge>;
    case SkillLevel.ADVANCED:
      return <Badge variant="outline" className="bg-yellow-900 text-white">Advanced</Badge>;
    case SkillLevel.EXPERT:
      return <Badge variant="outline" className="bg-red-900 text-white">Expert</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-900 text-white">Novice</Badge>;
  }
};

const getInterviewTypeBadge = (interviewType: InterviewType) => {
  switch (interviewType) {
    case InterviewType.BASIC:
      return <Badge variant="outline" className="bg-gray-900 text-white">Basic</Badge>;
    case InterviewType.ADVANCED:
      return <Badge variant="outline" className="bg-blue-900 text-white">Advanced</Badge>;
    case InterviewType.TECHNICAL:
      return <Badge variant="outline" className="bg-green-900 text-white">Technical</Badge>;
    case InterviewType.BEHAVIORAL:
      return <Badge variant="outline" className="bg-yellow-900 text-white">Behavioral</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-900 text-white">Basic</Badge>;
  }
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCandidatesTableColumns = (onViewDetails: (candidateId: number) => void): ColumnDef<any>[] => {
  return [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
      cell: ({ row }) => <div className="font-medium">{row.original.fullName}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'interviewType',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Interview Type" />,
      cell: ({ row }) => <div className="text-muted-foreground">{getInterviewTypeBadge(row.original.interviewType)}</div>,
    },
    {
      accessorKey: 'dateTaken',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date Taken" />,
      cell: ({ row }) => <div className="text-muted-foreground">{formatDate(row.original.dateTaken)}</div>,
    },
    {
      accessorKey: 'hardSkills',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Hard Skills" />,
      cell: ({ row }) => <div className="text-muted-foreground">{getSkillLevelBadge(row.original.hardSkills)}</div>,
    },
    {
      accessorKey: 'softSkills',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Soft Skills" />,
      cell: ({ row }) => <div className="text-muted-foreground">{getSkillLevelBadge(row.original.softSkills)}</div>,
    },
    {
      accessorKey: 'technicalSkills',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Technical Skills" />,
      cell: ({ row }) => <div className="text-muted-foreground">{getSkillLevelBadge(row.original.technicalSkills)}</div>,
    },
    {
      accessorKey: 'overallLevel',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Overall Level" />,
      cell: ({ row }) => <div className="text-muted-foreground">{getSkillLevelBadge(row.original.overallLevel)}</div>,
    },
    // {
    //   accessorKey: 'overallFeedback',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Overall Feedback" />,
    //   cell: ({ row }) => <div className="text-muted-foreground">{row.original.overallFeedback}</div>,
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
  ]
};
