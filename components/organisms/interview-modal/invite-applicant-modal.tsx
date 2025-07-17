'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ApplicantResponseDTO } from '@/types/applicant';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { applicantRepository } from '@/repositories/applicant-repository';
import { interviewRepository } from '@/repositories/interview-repository';

interface InviteApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSuccess: () => void;
  interviewId: string;
}

export const InviteApplicantModal: React.FC<InviteApplicantModalProps> = ({
  isOpen,
  onClose,
  onInviteSuccess,
  interviewId,
}) => {
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantResponseDTO | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [allApplicants, setAllApplicants] = useState<ApplicantResponseDTO[]>([]);
  const [fetchingApplicants, setFetchingApplicants] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alreadyInvitedApplicantIds, setAlreadyInvitedApplicantIds] = useState<number[]>([]); // New state for invited applicant IDs

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedApplicant(null);
      setEmail('');

      const fetchData = async () => {
        setFetchingApplicants(true);
        try {
          const [applicantsData, interviewData] = await Promise.all([
            applicantRepository.getAllApplicants(),
            interviewRepository.getInterviewById(parseInt(interviewId)),
          ]);

          setAllApplicants(applicantsData);
          const invitedIds = interviewData.invitations?.map((inv) => inv.applicantId) || [];
          setAlreadyInvitedApplicantIds(invitedIds);
        } catch (error) {
          console.error('Failed to fetch data for invitation modal:', error);
          toast.error('Failed to load applicants or interview data.');
        } finally {
          setFetchingApplicants(false);
        }
      };
      fetchData();
    } else {
      setSelectedApplicant(null);
      setEmail('');
      setAllApplicants([]);
      setSearchTerm('');
      setAlreadyInvitedApplicantIds([]); // Reset invited IDs on close
    }
  }, [isOpen, interviewId]); // Add interviewId to dependencies

  useEffect(() => {
    if (selectedApplicant) {
      setEmail(selectedApplicant.email);
    } else {
      setEmail('');
    }
  }, [selectedApplicant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) {
      toast.error('Please select an applicant.');
      return;
    }

    setLoading(true);
    try {
      const result = await applicantRepository.sendInvitation(selectedApplicant.email, interviewId);

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to send invitation');
      }

      toast.success('Invitation sent successfully!');
      onInviteSuccess();
      onClose();
      setSelectedApplicant(null); // Reset selected applicant after successful invite
    } catch (error: unknown) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Failed to send invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Applicant</DialogTitle>
          <DialogDescription>
            Send an email invitation to an applicant for an AI interview.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="applicant-search" className="text-right">
                Applicant
              </Label>
              <div className="col-span-3">
                <Input
                  id="applicant-search"
                  placeholder="Search applicant..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedApplicant(null); // Clear selected applicant on search
                    setEmail(''); // Clear email on search
                  }}
                  className="mb-2"
                />
                {fetchingApplicants ? (
                  <div className="p-2 text-center text-sm text-gray-500">Loading applicants...</div>
                ) : allApplicants.length === 0 ? (
                  <div className="p-2 text-center text-sm text-gray-500">No applicants found.</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {allApplicants
                      .filter(
                        (applicant) =>
                          applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          applicant.email.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((applicant) => {
                        const isAlreadyInvited = alreadyInvitedApplicantIds.includes(applicant.id);
                        return (
                          <div
                            key={applicant.id}
                            className={cn(
                              'p-2 flex items-center justify-between',
                              isAlreadyInvited
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-gray-800/50',
                              selectedApplicant?.id === applicant.id && !isAlreadyInvited
                                ? 'bg-blue-50 text-blue-700'
                                : '',
                            )}
                            onClick={() => {
                              if (!isAlreadyInvited) {
                                setSelectedApplicant(applicant);
                                setEmail(applicant.email);
                                setSearchTerm(applicant.fullName);
                              }
                            }}
                          >
                            <span>
                              {applicant.fullName} ({applicant.email})
                              {isAlreadyInvited && ' (Already Invited)'}
                            </span>
                            {selectedApplicant?.id === applicant.id && !isAlreadyInvited && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                className="col-span-3"
                readOnly // Email is now read-only, derived from selected applicant
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !selectedApplicant || fetchingApplicants}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
