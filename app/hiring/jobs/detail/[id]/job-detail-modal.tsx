'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { JobPostResponseDTO } from '@/types/job-post';
import {
    Building2,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    Users,
    X,
    Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmploymentType, getEmploymentTypeLabel } from '@/constants/enums/employment-type';
import { JobStatus } from '@/constants/enums/job-status';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SalaryType, getSalaryTypeLabel } from '@/constants/enums/salary-type';
import { JobBadge, EmploymentTypeBadge } from '@/components/molecules/badge';
import { JobPostModal } from '@/components/organisms/create-job-post-modal';

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
                <span className="text-white">
                    {formatSalary(Number(jobPost.salaryMin))} - {formatSalary(Number(jobPost.salaryMax))} {jobPost.currency} / {getSalaryTypeLabel(jobPost.salaryType as SalaryType)}
                </span>
            );
        }
        return <span className="text-gray-400 italic">Salary not specified</span>;
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="flex flex-col sm:max-w-7xl h-[85vh] p-0 gap-0 bg-card rounded-lg overflow-hidden">
                    {/* Fixed Header */}
                    <DialogHeader className="flex-none sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-gray-700 p-6 rounded-t-lg">
                        <div className="flex items-center justify-between ">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Briefcase className="w-8 h-8 text-foreground" />
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-bold text-foreground">
                                        {jobPost.title}
                                    </DialogTitle>
                                    <div className="flex items-center gap-3 mt-2">
                                        <EmploymentTypeBadge employmentType={jobPost.employmentType as EmploymentType} />
                                        <JobBadge status={jobPost.status as JobStatus} />
                                    </div>
                                </div>
                            </div>
                            <DialogClose className="rounded-full p-2 hover:bg-gray-800/50 transition-colors">
                                <X className="w-5 h-5 text-gray-400 cursor-pointer" />
                            </DialogClose>
                        </div>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full px-6">
                            <div className="space-y-8 py-6">
                                {/* Job Overview */}
                                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50  transition-colors min-h-[16rem]">
                                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Job Overview
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 group">
                                                <div className="p-2 rounded-lg bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors">
                                                    <MapPin className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Location</p>
                                                    <p className="text-white font-medium">{jobPost.location || 'Remote'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="p-2 rounded-lg bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors">
                                                    <Building2 className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Department</p>
                                                    <p className="text-white font-medium">{jobPost.department}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 group">
                                                <div className="p-2 rounded-lg bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors">
                                                    <Clock className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Employment Type</p>
                                                    <p className="text-white font-medium">{getEmploymentTypeLabel(jobPost.employmentType as EmploymentType)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="p-2 rounded-lg bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors">
                                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Salary Range</p>
                                                    {renderSalaryRange()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50  transition-colors min-h-[24rem] flex flex-col">
                                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Job Description
                                    </h3>
                                    <div className="prose prose-invert max-w-none flex-grow">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {jobPost.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Fixed Footer */}
                    <DialogFooter className="flex-none border-t border-gray-700 p-4 flex justify-end gap-3 bg-card">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="hover:bg-gray-800/50 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleEdit}
                            className="bg-primary hover:bg-primary/90 text-white gap-2 cursor-pointer"
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