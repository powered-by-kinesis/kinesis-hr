import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { AnalysisLanguage } from '@/components/organisms/analysis-language';

export function StepOne({
  isOpen,
  onOpenChange,
  onNext,
  onBack,
  payloadData,
  setPayloadData,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  payloadData: {
    jobDescription: string;
    localLanguage: string;
  };
  setPayloadData: (data: { jobDescription: string; localLanguage: string }) => void;
}) {
  const [jobDescription, setJobDescription] = useState(payloadData.jobDescription);
  const [language, setLanguage] = useState(payloadData.localLanguage);

  const handleNext = () => {
    setPayloadData({
      jobDescription: jobDescription,
      localLanguage: language,
    });
    onNext();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-[95vw] w-full sm:max-w-[600px] lg:max-w-[800px] max-h-[90dvh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            AI HR Assistant Setup
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground">
            Let me help you find the perfect candidate. Start by providing the job description you
            want to analyze.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="job-description" className="text-sm sm:text-base">
              Job Description{' '}
              <span className="text-xs text-muted-foreground">(Minimum 50 characters)</span>
              <span className="text-xs text-red-500">*</span>
            </Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Example:
  We are seeking a Senior Software Engineer with 5+ years of experience in full-stack development, Strong proficiency in React, Node.js, and TypeScript, Experience with cloud services (AWS/GCP), Track record of leading technical projects, Excellent problem-solving and communication skills"
              className="min-h-[80px] sm:min-h-[100px] max-h-[120px] sm:max-h-[150px] resize-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-sm sm:text-base"
              maxLength={5000}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm">
              <p className="text-muted-foreground">
                Tip: Include key requirements, responsibilities, and qualifications
              </p>
              <span className="text-muted-foreground">{jobDescription.length}/5000</span>
            </div>
          </div>

          <div className="grid gap-3">
            <AnalysisLanguage language={language} setLanguage={setLanguage} />
            <p className="text-xs sm:text-sm text-muted-foreground">
              This language will be used for analyzing the job description and generating interview
              materials
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto border-2 bg-card order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={jobDescription.trim().length < 50}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 order-1 sm:order-2"
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
