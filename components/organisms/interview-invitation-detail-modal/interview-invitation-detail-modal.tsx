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
import { InterviewInvitationResponseDTO } from '@/types/interview/InterviewInvitationResponseDTO';
import { MapPin, Briefcase, Clock, Users, X, Mail, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/format-date';
import { SkillLevelBadge } from '@/components/molecules/badge/skill-level';

interface CustomQuestion {
  question: string;
  type: string;
}

interface InterviewSkill {
  name: string;
  description: string;
}

interface InterviewInvitationDetailModalProps {
  invitation: InterviewInvitationResponseDTO | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterviewInvitationDetailModal({
  invitation,
  isOpen,
  onOpenChange,
}: InterviewInvitationDetailModalProps) {
  if (!invitation || !invitation.applicant || !invitation.interview) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground">Interview data is not available.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const { applicant, interview } = invitation;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-7xl h-[85vh] p-0 gap-0 bg-card rounded-lg overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="flex-none sticky top-0 z-10 bg-card/95 backdrop-blur-sm p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold text-foreground">
                  {applicant.fullName}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="text-sm">
                    {interview.interviewName}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {formatDate(interview.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>
            <DialogClose className="rounded-full p-2 hover:bg-primary/10 transition-colors">
              <X className="w-5 h-5 text-foreground cursor-pointer hover:text-primary" />
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6">
            <div className="space-y-8 py-6">
              {/* Candidate Overview */}
              <Card className="p-8 min-h-[16rem]">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Candidate Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                      <div className="p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm">Email</p>
                        <p className="text-foreground font-medium">{applicant.email}</p>
                      </div>
                    </div>
                    {applicant.phone && (
                      <div className="flex items-center gap-4 group">
                        <div className="p-2 rounded-lg">
                          <Phone className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-foreground text-sm">Phone</p>
                          <p className="text-foreground font-medium">{applicant.phone}</p>
                        </div>
                      </div>
                    )}
                    {applicant.location && (
                      <div className="flex items-center gap-4 group">
                        <div className="p-2 rounded-lg">
                          <MapPin className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-foreground text-sm">Location</p>
                          <p className="text-foreground font-medium">{applicant.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                      <div className="p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm">Applied At</p>
                        <p className="text-foreground font-medium">
                          {formatDate(interview.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2 rounded-lg">
                        <Briefcase className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm">Interview Type</p>
                        <p className="text-foreground font-medium">AI Interview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Skills Assessment */}
              {applicant.skills && applicant.skills.length > 0 && (
                <Card className="p-8 min-h-[16rem]">
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Skills Assessment
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {applicant.skills.map((skill, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <SkillLevelBadge level={skill.level} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Interview Details */}
              <Card className="p-8 min-h-[16rem]">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Interview Details
                </h3>
                <div className="space-y-6">
                  {/* Interview Name */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="text-lg font-medium text-foreground mb-2">Interview Name</h4>
                    <p className="text-foreground/90">{interview.interviewName}</p>
                  </div>

                  {/* Custom Questions */}
                  {Array.isArray(interview.customQuestionList) &&
                    interview.customQuestionList.length > 0 && (
                      <div className="p-4 rounded-lg bg-card border">
                        <h4 className="text-lg font-medium text-foreground mb-4">
                          Interview Questions
                        </h4>
                        <div className="space-y-3">
                          {(interview.customQuestionList as unknown as CustomQuestion[]).map(
                            (question, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-md bg-accent/10 backdrop-blur-sm"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                                    Q{index + 1}
                                  </span>
                                </div>
                                <p className="text-foreground/90">{question.question}</p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Required Skills */}
                  {Array.isArray(interview.skills) && interview.skills.length > 0 && (
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="text-lg font-medium text-foreground mb-4">Required Skills</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(interview.skills as unknown as InterviewSkill[]).map((skill, index) => (
                          <div key={index} className="p-4 rounded-lg bg-accent/10 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-foreground">{skill.name}</h5>
                              <Badge variant="outline" className="bg-primary/10">
                                Required
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground/80">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interview Recording */}
                  {interview.signedUrl && (
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="text-lg font-medium text-foreground mb-4">
                        Interview Recording
                      </h4>
                      <div className="aspect-video rounded-lg overflow-hidden bg-accent/10 backdrop-blur-sm">
                        <video
                          src={interview.signedUrl}
                          controls
                          className="w-full h-full object-cover"
                          poster="/video-placeholder.png"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
