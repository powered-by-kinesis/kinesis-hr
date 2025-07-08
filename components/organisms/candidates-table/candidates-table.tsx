'use client';

import * as React from 'react';
import { CandidateDetailsModal } from '@/components/organisms/candidate-details-modal';
import { CandidateRankingResponseDTO } from '@/types/candidate-ranking';
import { ApplicantResponseDTO } from '@/types/applicant';
import { getCandidatesTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';

type CandidateData = ApplicantResponseDTO;
interface CandidatesTableProps {
  data: CandidateData[];
}

export function CandidatesTable({ data }: CandidatesTableProps) {
  const [selectedCandidate, setSelectedCandidate] =
    React.useState<CandidateRankingResponseDTO | null>(null);
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
        summary:
          'Spearheaded strategic growth in new verticals at top firms, generating significant revenue and achieving sales targets; Boston College alumnus. Extensive account executive experience at top companies, strong soft skills, no founder roles',
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
        justification:
          'Strong candidate with extensive B2B sales experience and proven track record in SaaS environment. Excellent communication skills and strategic thinking abilities.',
        key_strengths: [
          'Proven sales track record',
          'Strong communication skills',
          'Strategic thinking',
          'SaaS experience',
          'Account management expertise',
        ],
        key_weaknesses: ['No startup experience', 'Limited technical background'],
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

  const columns = getCandidatesTableColumns(handleViewDetails);

  return (
    <>
      <DataTable columns={columns} data={data} searchColumn="fullName" />
      <CandidateDetailsModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRequestInterview={handleRequestInterview}
      />
    </>
  );
}
