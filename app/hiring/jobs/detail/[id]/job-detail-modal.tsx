'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { JobPostResponseDTO } from '@/types/job-post';
import { Building2, MapPin, Briefcase, Clock, DollarSign, Users, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmploymentType, getEmploymentTypeLabel } from '@/constants/enums/employment-type';
import { JobStatus } from '@/constants/enums/job-status';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SalaryType, getSalaryTypeLabel } from '@/constants/enums/salary-type';
import { JobBadge, EmploymentTypeBadge } from '@/components/molecules/badge';
import { JobPostModal } from '@/components/organisms/job-post-modal';
import { Card } from '@/components/ui/card';

interface JobDetailModalProps {
  jobPost: JobPostResponseDTO;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailModal({ jobPost, isOpen, onOpenChange }: JobDetailModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const renderSalaryRange = () => {
    if (jobPost.salaryMin && jobPost.salaryMax && jobPost.salaryType && jobPost.currency) {
      return (
        <span className="text-foreground">
          {formatSalary(Number(jobPost.salaryMin))} - {formatSalary(Number(jobPost.salaryMax))}{' '}
          {jobPost.currency} / {getSalaryTypeLabel(jobPost.salaryType as SalaryType)}
        </span>
      );
    }
    return <span className="text-foreground italic">Salary not specified</span>;
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col max-w-full sm:max-w-[95vw] lg:max-w-7xl h-[85vh] sm:h-[90vh] p-0 gap-0 bg-card rounded-lg overflow-hidden">
          {/* Fixed Header */}
          <DialogHeader className="flex-none sticky top-0 z-10 bg-card/95 backdrop-blur-sm p-3 sm:p-6 rounded-t-lg relative">
            {/* Close button - always top-right */}
            <DialogClose className="absolute top-3 right-3 sm:top-6 sm:right-6 rounded-full p-2 hover:bg-primary/10 transition-colors z-20">
              <X className="w-5 h-5 text-foreground cursor-pointer hover:text-primary" />
            </DialogClose>

            <div className="flex items-center gap-3 sm:gap-4 pr-12 sm:pr-16">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-xl flex-shrink-0">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl sm:text-3xl font-bold text-foreground truncate">
                  {jobPost.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                  <EmploymentTypeBadge employmentType={jobPost.employmentType as EmploymentType} />
                  <JobBadge status={jobPost.status as JobStatus} />
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-3 sm:px-6">
              <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
                {/* Job Overview */}
                <Card className="p-4 sm:p-8 min-h-[12rem] sm:min-h-[16rem]">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Job Overview
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4 group">
                        <div className="p-2 rounded-lg flex-shrink-0">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground text-xs sm:text-sm">Location</p>
                          <p className="text-foreground font-medium text-sm sm:text-base truncate">
                            {jobPost.location || 'Remote'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 group">
                        <div className="p-2 rounded-lg flex-shrink-0">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground text-xs sm:text-sm">Department</p>
                          <p className="text-foreground font-medium text-sm sm:text-base truncate">
                            {jobPost.department}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4 group">
                        <div className="p-2 rounded-lg flex-shrink-0">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground text-xs sm:text-sm">Employment Type</p>
                          <p className="text-foreground font-medium text-sm sm:text-base">
                            {getEmploymentTypeLabel(jobPost.employmentType as EmploymentType)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 group">
                        <div className="p-2 rounded-lg flex-shrink-0">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground text-xs sm:text-sm">Salary Range</p>
                          <div className="text-sm sm:text-base break-words">
                            {renderSalaryRange()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Job Description */}
                <Card className="p-4 sm:p-8 max-h-[20rem] sm:max-h-[24rem] flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    Job Description
                  </h3>
                  <div className="prose prose-invert max-w-none flex-grow">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {jobPost.description}
                    </p>
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Footer */}
          <DialogFooter className="flex-none p-3 sm:p-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 bg-card">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-800/50 cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/90 text-white gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Pencil className="w-4 h-4" />
              Edit Description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <JobPostModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        jobPost={jobPost}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
