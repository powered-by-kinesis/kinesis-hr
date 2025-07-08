/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  MapPin,
  Play,
  Clock,
  DollarSign,
  Star,
  Badge as BadgeIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CandidateRankingResponseDTO } from '@/types/candidate-ranking';

interface CandidateDetailsModalProps {
  candidate: CandidateRankingResponseDTO | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestInterview?: (candidateId: string) => void;
}

// Skill assessment data structure
interface SkillAssessment {
  name: string;
  level: string;
  rating: 'Senior' | 'Experienced' | 'Excellent' | 'Good' | 'Basic';
  icon?: React.ReactNode;
}

// Mock skill assessments based on the image
const mockSkillAssessments: SkillAssessment[] = [
  {
    name: 'B2B sales',
    level: '8+ yrs experience',
    rating: 'Senior',
    icon: <BadgeIcon className="h-4 w-4" />,
  },
  {
    name: 'Human Data Management',
    level: '2+ yrs experience',
    rating: 'Senior',
    icon: <BadgeIcon className="h-4 w-4" />,
  },
  {
    name: 'Hubspot CRM',
    level: '4+ yrs experience',
    rating: 'Experienced',
    icon: <BadgeIcon className="h-4 w-4" />,
  },
  {
    name: 'SaaS solutions',
    level: '8+ yrs experience',
    rating: 'Experienced',
    icon: <BadgeIcon className="h-4 w-4" />,
  },
  {
    name: 'Soft skills',
    level: 'C1 (Excellent)',
    rating: 'Excellent',
    icon: <BadgeIcon className="h-4 w-4" />,
  },
];

function getRatingColor(rating: string): string {
  switch (rating) {
    case 'Senior':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Experienced':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Excellent':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Good':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function CandidateDetailsModal({
  candidate,
  isOpen,
  onOpenChange,
}: CandidateDetailsModalProps) {
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen && candidate) {
      router.push(`/candidates/${candidate.candidate_id}`);
      onOpenChange(false);
    }
  }, [isOpen, candidate, router, onOpenChange]);

  return null;
}
